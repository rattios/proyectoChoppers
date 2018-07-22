import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RutaService } from '../../services/ruta.service';
import { SharedService } from '../../services/sucursales.service';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
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

  constructor(private sharedService: SharedService, private http: HttpClient, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {     
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
    this.empresa_id = localStorage.getItem('shoppers_id');
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
        } 
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
      }
    );
    this.paymentForm.controls['expiration_year'].valueChanges.subscribe(
      (selectedValue) => {
        if (this.paymentForm.get('expiration_month').value != '') {
          this.validate_month = OpenPay.card.validateExpiry(this.paymentForm.get('expiration_month').value,selectedValue);   
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
      }
    },
    msg => { 
    });
  }

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
    this.cliente.external_id = localStorage.getItem('shoppers_id');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa('sk_05a6d8db02784e26b21142d36a2fe44f' + ":"));
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
    headers = headers.append("Authorization", "Basic " + btoa('sk_05a6d8db02784e26b21142d36a2fe44f' + ":"));
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
    headers = headers.append("Authorization", "Basic " + btoa('sk_05a6d8db02784e26b21142d36a2fe44f' + ":"));
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
