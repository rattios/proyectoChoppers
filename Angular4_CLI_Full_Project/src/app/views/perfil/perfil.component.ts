import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RutaService } from '../../services/ruta.service';
import { SharedService } from '../../services/sucursales.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare var OpenPay;

@Component({
  templateUrl: 'perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  public imagen: string = 'assets/img/avatars/p.png';
  public nombre: string = '';
  public email: string = '';
  public clave: string = '**********';
  public empresa_id: string = '';
  public datos: any;
  public datos1: any;
  public datos2: any;
  public datos3: any;
  public cards = [];
  public validate_card: boolean = true;
  public validate_cvv: boolean = true;
  public validate_month: boolean = true;
  public type_card: string = '';
  public delete_card: any = {};
  public paymentForm: FormGroup;
  public formErrors = {
    "card_number":"",
    "holder_name":"",
    "expiration_year":"",
    "expiration_month":"",
    "cvv2":""
  };
  private cliente = {
    "name":"",
    "email":"",
    "external_id":"",
    "requires_account": true
  }
  private create_card = {
    token_id: '',
    tarjeta: '',
    fecha_vencimiento: '',
    tipo: '',
    empresa_id: ''
  }
  private update_client = {
    customer_id: ''
  }
  @ViewChild('fileInput') fileInput: ElementRef;
  clear = false;
  fileIMG = null;
  imgUpload = null;
  loadinImg = false;  
  fileSucursal = null;
  public url:string = localStorage.getItem('shoppers_imagen');
  public data:any;
  public nombre1 = {
    nombre: ''
  };
  public email1 = {
    email: ''
  };
  public clave1 = {
    password: ''
  }; 
  public imagen1 = {
    imagen: ''
  }; 

  constructor(private sharedService: SharedService, private http: HttpClient, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {     
    this.getData();
    OpenPay.setId('mlfpboaflbbaboev97wm');
    OpenPay.setApiKey('pk_9d474dec96e54168b9eba537b8b65f02');
    OpenPay.setSandboxMode(true);
  }

  ngOnInit(): void {
    this.imagen = localStorage.getItem('shoppers_imagen');
    if (this.imagen == '') {
      this.imagen = 'assets/img/avatars/flats.png';
    }
    this.nombre = localStorage.getItem('shoppers_nombre');
    this.email = localStorage.getItem('shoppers_email');
    this.empresa_id = localStorage.getItem('shoppers_empresa_id');
    this.getCard();
    this.paymentForm = this.builder.group({
      card_number: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
      holder_name: ['', [Validators.required]],
      expiration_year: ['', [Validators.required, Validators.maxLength(2)]],
      expiration_month: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      cvv2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      token_id: [''],
      device_session_id: ['']

    });
    this.paymentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.paymentForm.controls['card_number'].valueChanges.subscribe(
      (selectedValue) => {
        this.validate_card = OpenPay.card.validateCardNumber(selectedValue); 
        if (this.validate_card) {
          this.type_card = OpenPay.card.cardType(selectedValue.toString());
        } else {
          this.type_card = '';
        };
        if (selectedValue) {
          if (selectedValue.toString().length > 16) {
            this.paymentForm.patchValue({card_number: selectedValue.toString().substr(0, 16)});
          };
        };  
      }
    );
    this.paymentForm.controls['cvv2'].valueChanges.subscribe(
      (selectedValue) => {
        this.validate_cvv = OpenPay.card.validateCVC(selectedValue,this.paymentForm.get('card_number').value.toString());   
      }
    );
    this.paymentForm.controls['expiration_month'].valueChanges.subscribe(
      (selectedValue) => {
        if (this.paymentForm.get('expiration_year').value != '') {
          this.validate_month = OpenPay.card.validateExpiry(selectedValue, this.paymentForm.get('expiration_year').value);   
        }
        if (selectedValue) {
          if (selectedValue.toString().length > 2) {
            this.paymentForm.patchValue({expiration_month: selectedValue.toString().substr(0, 2)});
          }
        }
      }
    );
    this.paymentForm.controls['expiration_year'].valueChanges.subscribe(
      (selectedValue) => {
        if (this.paymentForm.get('expiration_month').value != '') {
          this.validate_month = OpenPay.card.validateExpiry(this.paymentForm.get('expiration_month').value,selectedValue);   
        }
        if (selectedValue) {
          if (selectedValue.toString().length > 2) {
            this.paymentForm.patchValue({expiration_year: selectedValue.toString().substr(0, 2)});
          }
        }
      }
    );
    let deviceSessionId = OpenPay.deviceData.setup(this.paymentForm.value);
    this.paymentForm.patchValue({device_session_id: deviceSessionId});
  }

  getCard() {
    this.http.get(this.ruta.get_ruta()+'tarjetas/empresa/'+this.empresa_id)
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.cards = this.datos.tarjetas;
      if (this.cards.length > 0) {
        for (var i = 0; i < this.cards.length; ++i) {
          var card = this.cards[i].tarjeta.toString();
          this.cards[i].tarjeta = card.substr(card.length - 4);
        }
        this.update_client.customer_id = this.cards[0].empresa.customer_id;
      };
    },
    msg => { 
    });
  };

  getData() {
    this.http.get(this.ruta.get_ruta()+'sistema/tarifas/pk')
    .toPromise()
    .then(
    data => {
      this.datos3 = data;
    },
    msg => { 
    });
  };

  create_token(paymentForm){
    if (this.paymentForm.valid) {
      if (this.validate_card) {
        if (this.validate_cvv) {
          if (this.validate_month) {
            this.spinnerService.show();
            var that = this;
            OpenPay.token.create(paymentForm.value, function SuccessCallback(response) { 
              let token_id = response.data.id;
              that.paymentForm.patchValue({token_id: token_id});
              if (that.cards.length === 0) {
                that.create_user();
              } else {
                that.saveCard();
              }
            }
            , function ErrorCallback(response) {
              that.toastr.error('Ha ocurrido un error al conectarse al gateway de pago', 'Error', {
                timeOut: 3000
              });
              that.spinnerService.hide();
            });
          } else {
            this.toastr.error('Fecha de expiración inválida', 'Error', {
              timeOut: 5000
            });
          }
        } else {
          this.toastr.error('Código de seguridad inválido', 'Error', {
            timeOut: 5000
          });
        }
      } else {
        this.toastr.error('Número de tarjeta inválido', 'Error', {
          timeOut: 5000
        });
      }
    } else {
      this.validateAllFormFields(this.paymentForm);
      this.toastr.error('Faltan datos para guardar la tarjeta', 'Error', {
        timeOut: 3000
      });
    }
  }

  create_user(){
    this.cliente.name = this.nombre;
    this.cliente.email = this.email;
    this.cliente.external_id = localStorage.getItem('shoppers_empresa_id');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(this.datos3.tarifas.tarifa_sk + ":"));
    headers = headers.append("Content-Type", "application/json");
    this.http.post(this.ruta.get_open()+'customers', this.cliente, {
      headers: headers
    })
    .toPromise()
    .then(
    data => {
      this.datos1 = data;
      this.update_client.customer_id = this.datos1.id;
      this.http.put(this.ruta.get_ruta()+'empresas/'+this.empresa_id, this.update_client)
      .toPromise()
      .then(
      data => {
        console.log(data);
        this.saveCard();
      },
      msg => { 
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 3000
        });
        this.spinnerService.hide();
      });
    },
    msg => {
      this.toastr.error('Ha ocurrido un error al conectarse al gateway de pago', 'Error', {
        timeOut: 3000
      });
      this.spinnerService.hide();
    });
  }

  saveCard(){
    this.create_card.empresa_id = this.empresa_id;
    this.create_card.fecha_vencimiento = this.paymentForm.get('expiration_month').value + '/' + this.paymentForm.get('expiration_year').value;
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(this.datos3.tarifas.tarifa_sk + ":"));
    headers = headers.append("Content-Type", "application/json");
    this.http.post(this.ruta.get_open()+'customers/'+this.update_client.customer_id+'/cards', this.paymentForm.value, {
      headers: headers
    })
    .toPromise()
    .then(
    data => {
      this.datos1 = data;
      this.create_card.token_id = this.datos1.id;
      this.create_card.tarjeta = this.paymentForm.get('card_number').value;
      this.create_card.tipo = this.datos1.brand;
      this.http.post(this.ruta.get_ruta()+'tarjetas', this.create_card)
      .toPromise()
      .then(
      data => {
        document.getElementById('card-modal').click();
        this.getCard();
        this.spinnerService.hide();
        this.toastr.success('Tarjeta agregada con éxito', 'Éxito', {
          timeOut: 3000
        });
      },
      msg => {
        console.log(msg);
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 3000
        });
        this.spinnerService.hide();
      });
    },
    msg => {
      console.log(msg);
      this.spinnerService.hide();
    });
  }

  deleteCard(){
    this.spinnerService.show();
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(this.datos3.tarifas.tarifa_sk + ":"));
    headers = headers.append("Content-Type", "application/json");
    this.http.delete(this.ruta.get_open()+'customers/'+this.update_client.customer_id+'/cards/'+this.delete_card.token_id, {
      headers: headers
    })
    .toPromise()
    .then(
    data => {
      this.http.delete(this.ruta.get_ruta()+'tarjetas/'+this.delete_card.id)
      .toPromise()
      .then(
      data => {
        document.getElementById('modal-delete').click();
        this.getCard();
        this.spinnerService.hide();
        this.toastr.success('Tarjeta eliminada con éxito', 'Éxito', {
          timeOut: 3000
        });
      },
      msg => {
        console.log(msg);
        this.toastr.error('Ha ocurrido un error al eliminar la tarjeta', 'Error', {
          timeOut: 3000
        });
        this.spinnerService.hide();
      });     
    },
    msg => {
      console.log(msg);
      this.toastr.error('Ha ocurrido un error al eliminar la tarjeta', 'Error', {
        timeOut: 3000
      });
      this.spinnerService.hide();
    });
  }

  editName(){
    this.spinnerService.show();
    this.http.put(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id'), this.nombre1)
    .toPromise()
    .then(
    data => {
      this.nombre = this.nombre1.nombre;
      localStorage.setItem('shoppers_nombre', this.nombre1.nombre);
      document.getElementById('edit-delete').click();
      this.spinnerService.hide();
      this.toastr.success('Nombre editado con éxito', 'Éxito', {
        timeOut: 3000
      });
    },
    msg => {
      console.log(msg);
      this.toastr.error('Ha ocurrido un error al editar el nombre', 'Error', {
        timeOut: 3000
      });
      this.spinnerService.hide();
    });  
  }

  editEmail(){
    this.spinnerService.show();
    this.http.put(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id'), this.email1)
    .toPromise()
    .then(
    data => {
      this.email = this.email1.email;
      localStorage.setItem('shoppers_email', this.email1.email);
      document.getElementById('edit-delete').click();
      this.spinnerService.hide();
      this.toastr.success('Email editado con éxito', 'Éxito', {
        timeOut: 3000
      });
    },
    msg => {
      console.log(msg);
      this.toastr.error('Ha ocurrido un error al editar el email', 'Error', {
        timeOut: 3000
      });
      this.spinnerService.hide();
    });  
  }

  editPassword(){
    this.spinnerService.show();
    this.http.put(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id'), this.clave1)
    .toPromise()
    .then(
    data => {
      this.email = this.email1.email;
      document.getElementById('edit-delete').click();
      this.spinnerService.hide();
      this.toastr.success('Password editado con éxito', 'Éxito', {
        timeOut: 3000
      });
    },
    msg => {
      console.log(msg);
      this.toastr.error('Ha ocurrido un error al editar el password', 'Error', {
        timeOut: 3000
      });
      this.spinnerService.hide();
    });  
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var target:EventTarget;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event:any) => {
        this.imagen = event.target.result;
      }
    }
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      this.fileIMG = event.target.files[0];
      this.subirImagen();
    }
  }

  clearFile() {
    this.imgUpload = null;
    this.fileInput.nativeElement.value = '';
    this.clear = false;
    this.imagen = 'assets/img/avatars/flats.png';
    localStorage.setItem('shoppers_imagen','https://api.shopperama.mx/images/flats.png');
    this.imagen1.imagen = 'https://api.shopperama.mx/images/flats.png';
    this.sharedService.sucursalData.emit(this.imagen);
    this.editImagen();
  }

  subirImagen(): void {   
    this.spinnerService.show();
    const formModel = this.prepareSave();
    this.http.post(this.ruta.get_ruta()+'imagenes?token='+localStorage.getItem('shoppers_token'), formModel)
     .toPromise()
     .then(
       data => { // Success
          console.log(data);
          this.data = data;
          this.imgUpload = this.data.imagen;
          this.imagen1.imagen = this.data.imagen;
          this.editImagen();

          //Solo admitimos imágenes.
           if (!this.fileIMG.type.match('image.*')) {
                return;
           }

           this.clear = true;

           console.log('success');
       },
       msg => { // Error
         console.log(msg);
         console.log(msg.error.error);
         this.spinnerService.hide();

         //token invalido/ausente o token expiro
         if(msg.status == 400 || msg.status == 401){ 
              //alert(msg.error.error);
              //ir a login
              //this.showToast('warning', 'Warning!', msg.error.error);
              console.log('400 0 401');
          }
          else { 

              //alert(msg.error.error);
              //this.showToast('error', 'Error!', msg.error.error);
              console.log('error subiendo la imagen');
          }
       }
     );
  }

  editImagen(){ 
    this.http.put(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id'), this.imagen1)
    .toPromise()
    .then(
    data => {
      localStorage.setItem('shoppers_imagen', this.imagen1.imagen);
      this.sharedService.sucursalData.emit(this.imgUpload);
      this.spinnerService.hide();
      this.toastr.success('Imagen editada con éxito', 'Éxito', {
        timeOut: 3000
      });
    },
    msg => {
      console.log(msg);
      this.toastr.error('Ha ocurrido un error al editar la imagen', 'Error', {
        timeOut: 3000
      });
      this.spinnerService.hide();
    });  
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('imagen', this.fileIMG);
    input.append('carpeta', 'empresas');
    input.append('url_imagen', 'https://api.shopperama.mx/images_uploads/');
    return input;
  }

  onValueChanged(data?: any) {
    if (!this.paymentForm) { return; }
    const form = this.paymentForm;

    for (const field in this.formErrors) { 
      const control = form.get(field);
      this.formErrors[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += true;
          console.log(field);
        }
      } 
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf:true });
        this.onValueChanged();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
}
