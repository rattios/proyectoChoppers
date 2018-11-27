import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap';
import { RutaService } from '../../services/ruta.service';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SharedService } from '../../services/sucursales.service';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';
import * as moment from 'moment';

declare var OpenPay;

@Component({
  templateUrl: 'publicar-cuestionarios.component.html',
  styleUrls: ['./publicar-cuestionarios.component.css','./foundation-theme.scss']
})
export class publicarCuestionariosComponent {

  @ViewChild('PublishModal') public lgModal: ModalDirective;
  @ViewChild('SelectCardModal') public tgModal: ModalDirective;
  public cuestionarios: any = [];
  public datosBudget: any;
  public Budget: any = [];
  public selected: any = [];
  public datos: any;
  public datos1: any;
  public datos2: any;
  public datos3: any;
  public datos4: any;
  public datos5: any;
  public isSelected = false;
  public cuestionarioDelete: any = {};
  public cuestionarioEdit: any = {};
  public campaignEdit: any = {};
  public campanas:any = [];
  public sucursales:any = [];
  public sucursal_id: any;
  public preferences:any = [];
  public selected_estados:any = [];
  public selected_municipios:any = [];
  public selected_colonias:any = [];

  public answers: any = [];
  public question_unique: string = '';
  public question_open: string = '';
  public cuestionario = {
    nombre:'',
    preguntas: []
  }
  public answers_edit: any = [];
  public question_uniqueE: string = '';
  public question_openE: string = '';
  public question_reference: string = '';
  public answers_reference: any = [];
  public create_cuestionario = {
    cuestionario: '',
    estado_pago: 1
  }
  public decline_cuestionario = {
    estado: 3,
    estado_pago: 0
  }
  public pay_cuestionario = {
    estado: 1,
    estado_pago: 1
  }
  public send_cuestionario = {
    estado: 2,
    estado_pago: 1
  }
  public comision = {
    customer_id: '',
    amount: '',
    description: ''
  }
  public send_items = {
    genero: '',
    edad: '',
    categorias: '',
    estados: '',
    municipios: '',
    localidades: '',
    cuestionario_id: '',
    sucursal: '',
    logo: '',
    token: localStorage.getItem('shoppers_token')
  }
  public questionEdit: any = {};
  public loading_cuest: boolean = true;
  public empty_cuest: boolean = true;
  public cards = [];
  public customer_id: '';
  public empresa_id: string = '';
  public selectedRadio: any = '';
  public infoCard: any = {};
  public validate_cvv: boolean = true;
  public nombre: string = '';
  public email: string = '';

  public paymentForm: FormGroup;
  public formErrors = {
    "cvv2":""
  };
  public validate_card: boolean = true;
  public validate_cvv1: boolean = true;
  public validate_month: boolean = true;
  public type_card: string = '';
  public delete_card: any = {};
  public paymentCardForm: FormGroup;
  public formErrors1 = {
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
  oldValue: any;

  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
    this.getData();
    OpenPay.setId('mlfpboaflbbaboev97wm');
    OpenPay.setApiKey('pk_9d474dec96e54168b9eba537b8b65f02');
    OpenPay.setSandboxMode(true);
  }

  ngOnInit(): void {
    this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
    this.empresa_id = localStorage.getItem('shoppers_empresa_id');
    this.sucursal_id = this.sucursales[0].id;
    this.nombre = localStorage.getItem('shoppers_nombre');
    this.email = localStorage.getItem('shoppers_email');
    this.paymentForm = this.builder.group({
      cvv2: ['', [Validators.required, Validators.maxLength(3)]],
      source_id: [''],
      method: ['card'],
      amount: [''],
      currency: ['MXN'],
      description: [''],
      device_session_id: ['']
    });
    this.paymentForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.getCuestionarios();
    this.paymentForm.controls['cvv2'].valueChanges.subscribe(
      (selectedValue) => {
        this.validate_cvv = OpenPay.card.validateCVC(selectedValue);   
      }
    );
    this.paymentCardForm = this.builder.group({
      card_number: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(19)]],
      holder_name: ['', [Validators.required]],
      expiration_year: ['', [Validators.required, Validators.maxLength(2)]],
      expiration_month: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      cvv2: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      token_id: [''],
      device_session_id: ['']

    });
    this.paymentCardForm.valueChanges.subscribe(data => this.onValueChanged1(data));
    this.onValueChanged1();
    this.paymentCardForm.controls['card_number'].valueChanges.subscribe(
      (selectedValue) => {
        this.validate_card = OpenPay.card.validateCardNumber(selectedValue); 
        if (this.validate_card) {
          this.type_card = OpenPay.card.cardType(selectedValue.toString());
        } else {
          this.type_card = '';
        }
        if (selectedValue) {
          if (selectedValue.toString().length > 16) {
            this.paymentForm.patchValue({card_number: selectedValue.toString().substr(0, 16)});
          };
        };  
      }
    );
    this.paymentCardForm.controls['cvv2'].valueChanges.subscribe(
      (selectedValue) => {
        this.validate_cvv1 = OpenPay.card.validateCVC(selectedValue,this.paymentCardForm.get('card_number').value.toString());   
      }
    );
    this.paymentCardForm.controls['expiration_month'].valueChanges.subscribe(
      (selectedValue) => {
        if (this.paymentCardForm.get('expiration_year').value != '') {
          this.validate_month = OpenPay.card.validateExpiry(selectedValue, this.paymentCardForm.get('expiration_year').value);   
        }
        if (selectedValue) {
          if (selectedValue.toString().length > 2) {
            this.paymentCardForm.patchValue({expiration_month: selectedValue.toString().substr(0, 2)});
          }
        }
      }
    );
    this.paymentCardForm.controls['expiration_year'].valueChanges.subscribe(
      (selectedValue) => {
        if (this.paymentCardForm.get('expiration_month').value != '') {
          this.validate_month = OpenPay.card.validateExpiry(this.paymentCardForm.get('expiration_month').value,selectedValue);   
        }
        if (selectedValue) {
          if (selectedValue.toString().length > 2) {
            this.paymentCardForm.patchValue({expiration_year: selectedValue.toString().substr(0, 2)});
          }
        }
      }
    );
    let deviceSessionId = OpenPay.deviceData.setup(this.paymentForm.value);
    this.paymentForm.patchValue({device_session_id: deviceSessionId});
  }

  getCuestionarios() {
    this.cuestionarios = [];
    this.loading_cuest = false;
    this.http.get(this.ruta.get_ruta()+'cuestionarios/sucursal/'+this.sucursal_id)
    .toPromise()
    .then(
    data => {
      this.datosBudget = data;
      this.Budget = this.datosBudget.cuestionarios;
      this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas')
      .toPromise()
      .then(
      data => {
        this.datos1 = data;
        this.campanas = this.datos1.sucursal.campanas;
        this.loading_cuest = true;
        for (var i = 0; i < this.Budget.length; ++i) {
          if (this.Budget[i].estado == 1) {
            this.Budget[i].nombre = JSON.parse(this.Budget[i].cuestionario).nombre;
            if (this.Budget[i].estado_pago == 1 && this.Budget[i].estado == 2){
              this.Budget[i].estado = 'Publicada';
            } else if (this.Budget[i].estado_pago == 1 && this.Budget[i].estado == 1){
              this.Budget[i].estado = 'Pagada/Sin Publicar';
            } else {
              this.Budget[i].estado = 'Sin Publicar';
            }
            for (var j = 0; j < this.campanas.length; ++j) {
              if (this.campanas[j].id == this.Budget[i].campana_id) {
                this.Budget[i].campana = this.campanas[j].nombre;
                this.Budget[i].campanas = this.campanas[j];
              }
            }
            this.Budget[i].subTotal = (this.Budget[i].pagoxcuest * this.Budget[i].num_cuestionarios).toFixed(2);
            this.Budget[i].comisionTotal = (this.Budget[i].num_cuestionarios * this.Budget[i].comision).toFixed(2);
            this.cuestionarios.push(this.Budget[i]);
            console.log(this.cuestionarios);
          }
        }
        if (this.cuestionarios.length == 0) {
          this.empty_cuest = false;
        }
        this.getCard();
      },
      msg => { 

      });
    },
    msg => { 
      if (msg.status == 404) {
        this.loading_cuest = true;
        this.empty_cuest = false;
      }
    });
  }

  OpenPublic(){
    if (this.questionEdit.estado_pago == 1) {
      this.lgModal.show();
    } else {
      this.tgModal.show();
    }
  }

  resetCampaign(){
    this.isSelected = false;
    this.cuestionarioDelete = {};
    this.cuestionario.preguntas = [];
    this.create_cuestionario.cuestionario = '';
    this.question_open = '';
    this.question_openE = '';
    this.question_uniqueE = '';
    this.question_reference = '';
    this.answers_edit = [];
    this.questionEdit = {};
    this.infoCard = {};
  }

  getData() {
    this.http.get(this.ruta.get_ruta()+'sistema/tarifas/pk')
    .toPromise()
    .then(
    data => {
      this.datos5 = data;
    },
    msg => { 
    });
  }

  showEdit(cuestionario){
    this.cuestionarioEdit = cuestionario;
    this.cuestionario.nombre = cuestionario.nombre;
    var question = JSON.parse(cuestionario.cuestionario);
    this.cuestionario.preguntas = question.preguntas;
    let index = question.preguntas.findIndex((item) => item.respuestas === '');
    if(index !== -1){
      this.question_open = question.preguntas[index].pregunta;
    }
    this.campaignEdit = cuestionario.campanas;
    this.preferences = JSON.parse(this.campaignEdit.categorias);
    this.selected_estados = JSON.parse(this.campaignEdit.estados);
    this.selected_municipios = JSON.parse(this.campaignEdit.municipios);
    this.selected_colonias = JSON.parse(this.campaignEdit.localidades);
    this.cuestionarioEdit.total_cuestionario = cuestionario.pagoxcuest * cuestionario.num_cuestionarios;
  }

  deleteCuestionario(cuestionarioDelete){
    this.spinnerService.show();
    this.http.put(this.ruta.get_ruta()+'cuestionarios/'+this.cuestionarioDelete.id, this.decline_cuestionario)
    .toPromise()
    .then(
    data => {
      this.spinnerService.hide();
      this.toastr.success('Cuestionario rechazado con éxito','Éxito', {
        timeOut: 5000
      });
      this.cuestionarios = [];
      this.resetCampaign();
      this.getCuestionarios();
    },
    msg => {
      this.spinnerService.hide(); 
      this.toastr.error(msg.error.error,'Error', {
        timeOut: 5000
      });
    });
  } 

  update_sucursal(event){
    this.sucursal_id = event.target.value;
    this.campanas = [];
    this.Budget = [];
    this.getCuestionarios();
  } 

  send_notify(cuestionario){
    this.spinnerService.show();
    this.send_items.cuestionario_id = cuestionario.id;
    this.send_items.sucursal = this.datos1.sucursal.nombre;
    this.send_items.logo = this.datos1.sucursal.logo;
    for (var j = 0; j < this.campanas.length; ++j) {
      if (this.campanas[j].id == cuestionario.campana_id) {
        this.send_items.genero = this.campanas[j].genero;
        this.send_items.edad = this.campanas[j].edad;
        this.send_items.categorias = this.campanas[j].categorias;
        this.send_items.estados = this.campanas[j].estados;
        this.send_items.municipios = this.campanas[j].municipios;
        this.send_items.localidades = this.campanas[j].localidades;     
      }
    }
    this.http.put(this.ruta.get_ruta()+'cuestionarios/'+cuestionario.id, this.send_cuestionario)
    .toPromise()
    .then(
    data => {
      this.http.post(this.ruta.get_ruta()+'notificaciones/notificar/clientes', this.send_items)
      .toPromise()
      .then(
      data => {
        this.datos2 = data;
        this.spinnerService.hide();
        this.toastr.success(this.datos2.message,'Cuestionario enviado a App', {
          timeOut: 10000
        });
        this.cuestionarios = [];
        this.resetCampaign();
        this.getCuestionarios();
      },
      msg => {
        this.spinnerService.hide(); 
        this.toastr.error(msg.error.error,'Error', {
          timeOut: 5000
        });
      });
    },
    msg => {
      this.spinnerService.hide(); 
      this.toastr.error(msg.error.error,'Error', {
        timeOut: 5000
      });
    });
  }

  getCard() {
    this.cards = [];
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
        this.customer_id = this.cards[0].empresa.customer_id;
        this.selectedRadio = this.cards[0].token_id;
        this.update_client.customer_id = this.cards[0].empresa.customer_id;
      }
    },
    msg => { 
    
    });
  } 

  selectCard(){
    for (var i = 0; i < this.cards.length; ++i) {
      if (this.cards[i].token_id === this.selectedRadio) {
        var card = this.cards[i].tarjeta.toString();
        this.cards[i].tarjeta = card.substr(card.length - 4);
        this.infoCard = this.cards[i];
        this.paymentForm.patchValue({source_id: this.infoCard.token_id});
      };
    };
  };


  paymentQuestion(){
    if (this.paymentForm.valid) {
      this.spinnerService.show();
      this.questionEdit.total_comision = (this.questionEdit.num_cuestionarios * this.questionEdit.comision).toFixed(2);
      this.paymentForm.patchValue({amount: (this.questionEdit.total).toFixed(2)});
      this.paymentForm.patchValue({description: this.questionEdit.nombre});
      this.comision.customer_id = this.customer_id;
      this.comision.amount = this.questionEdit.total_comision;
      this.comision.description = this.questionEdit.nombre;
      let headers = new HttpHeaders();
      headers = headers.append("Authorization", "Basic " + btoa(this.datos5.tarifas.tarifa_sk + ":"));
      headers = headers.append("Content-Type", "application/json");
      this.http.post(this.ruta.get_open()+'customers/'+this.customer_id+'/charges', this.paymentForm.value, {
        headers: headers
      })
      .toPromise()
      .then(
      data => {
        this.datos3 = data;
        if (this.datos3.status == "completed") {
          this.http.post(this.ruta.get_open()+'fees', this.comision, {
            headers: headers
          })
          .toPromise()
          .then(
          data => {
            this.datos4 = data;
            if (this.datos4.status == "completed") {
              this.http.put(this.ruta.get_ruta()+'cuestionarios/'+this.questionEdit.id, this.pay_cuestionario)
              .toPromise()
              .then(
              data => {
                this.getCuestionarios();
                this.toastr.success('El pago se ha realizado con éxito', 'Éxito', {
                  timeOut: 5000
                });
                this.spinnerService.hide();
                document.getElementById('modal-confirm').click();
                this.lgModal.show();
              },
              msg => {
                this.toastr.success('El pago se ha realizado con éxito', 'Éxito', {
                  timeOut: 5000
                });
                this.spinnerService.hide();
                document.getElementById('modal-confirm').click();
                this.lgModal.show();
              });
            }
          },
          msg => {
            this.toastr.error('Ha ocurrido un error al conectarse al gateway de pago', 'Error', {
              timeOut: 3000
            });
            this.spinnerService.hide();
          });
        }
        this.spinnerService.hide();
      },
      msg => {
        this.toastr.error('Ha ocurrido un error al conectarse al gateway de pago', 'Error', {
          timeOut: 3000
        });
        this.spinnerService.hide();
      });
    } else {
      this.validateAllFormFields(this.paymentForm);
      this.toastr.error('Falta el código de seguridad para realizar la transacción', 'Error', {
        timeOut: 3000
      });
    };
  }; 

  create_token(){
    if (this.paymentCardForm.valid) {
      if (this.validate_card) {
        if (this.validate_cvv1) {
          if (this.validate_month) {
            let deviceSessionId = OpenPay.deviceData.setup(this.paymentCardForm.value);
            this.paymentCardForm.patchValue({device_session_id: deviceSessionId});
            this.spinnerService.show();
            var that = this;
            OpenPay.token.create(this.paymentCardForm.value, function SuccessCallback(response) { 
              let token_id = response.data.id;
              that.paymentCardForm.patchValue({token_id: token_id});
              if (that.cards.length === 0) {
                that.create_user();
              } else {
                console.log('entro');
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
      this.validateAllFormFields1(this.paymentCardForm);
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
    headers = headers.append("Authorization", "Basic " + btoa(this.datos5.tarifas.tarifa_sk + ":"));
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
    this.create_card.fecha_vencimiento = this.paymentCardForm.get('expiration_month').value + '/' + this.paymentCardForm.get('expiration_year').value;
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa(this.datos5.tarifas.tarifa_sk + ":"));
    headers = headers.append("Content-Type", "application/json");
    this.http.post(this.ruta.get_open()+'customers/'+this.update_client.customer_id+'/cards', this.paymentCardForm.value, {
      headers: headers
    })
    .toPromise()
    .then(
    data => {
      this.datos1 = data;
      this.create_card.token_id = this.datos1.id;
      this.create_card.tarjeta = this.paymentCardForm.get('card_number').value;
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

  onValueChanged1(data?: any) {
    if (!this.paymentCardForm) { return; }
    const form = this.paymentCardForm;

    for (const field in this.formErrors1) { 
      const control = form.get(field);
      this.formErrors1[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors1[field] += true;
          console.log(field);
        }
      } 
    }
  }

  validateAllFormFields1(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf:true });
        this.onValueChanged1();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields1(control);
      }
    });
  }
}
