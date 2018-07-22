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
  public cuestionarios: any = [];
  public datosBudget: any;
  public Budget: any = [];
  public selected: any = [];
  public datos: any;
  public datos1: any;
  public datos2: any;
  public datos3: any;
  public datos4: any;
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
  public selectedRadio: any;
  public infoCard: any = {};
  public validate_cvv: boolean = true;
  public nombre: string = '';
  public email: string = '';

  public paymentForm: FormGroup;
  public formErrors = {
    "cvv2":""
  };

  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
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
            if (this.Budget[i].estado_pago == 0) {
              this.Budget[i].estado = 'Sin Publicar';
            } else {
              this.Budget[i].estado = 'Publicada';
            }
            for (var j = 0; j < this.campanas.length; ++j) {
              if (this.campanas[j].id == this.Budget[i].campana_id) {
                this.Budget[i].campana = this.campanas[j].nombre;
                this.Budget[i].campanas = this.campanas[j];
              }
            }
            this.cuestionarios.push(this.Budget[i]);
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
      headers = headers.append("Authorization", "Basic " + btoa('sk_05a6d8db02784e26b21142d36a2fe44f' + ":"));
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
              this.toastr.success('El pago se ha realizado con éxito', 'Éxito', {
                timeOut: 5000
              });
              document.getElementById('modal-confirm').click();
              this.lgModal.show();
            }
            this.spinnerService.hide();
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
