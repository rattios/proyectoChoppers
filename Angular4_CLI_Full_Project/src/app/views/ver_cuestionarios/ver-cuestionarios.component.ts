import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
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

@Component({
  templateUrl: 'ver-cuestionarios.component.html',
  styleUrls: ['./ver-cuestionarios.component.css','./foundation-theme.scss']
})
export class verCuestionariosComponent {

  public cuestionarios: any = [];
  public datosBudget: any;
  public Budget: any = [];
  public Budget2: any = [];
  public selected: any = [];
  public datos: any;
  public datos1: any;
  public datos2: any;
  public datos3: any;
  public isSelected = false;
  public cuestionarioDelete: any = {};
  public cuestionarioEdit: any = {};
  public campanas:any = [];
  public campanas2:any = [];
  public sucursales:any = [];
  public sucursal_id: any;

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
    nombre: '',
    descripcion: '',
    cuestionario: '',
    estado_pago: 0,
    estado: 1
  }
  public cuestionarios_activos: any[] = [];
  public cuestionarios_finalizados: any[] = [];
  public months = [
    {id:'01', nombre:'Enero'},
    {id:'02', nombre:'Febrero'},
    {id:'03', nombre:'Marzo'},
    {id:'04', nombre:'Abril'},
    {id:'05', nombre:'Mayo'},
    {id:'06', nombre:'Junio'},
    {id:'07', nombre:'Julio'},
    {id:'08', nombre:'Agosto'},
    {id:'09', nombre:'Septiembre'},
    {id:'10', nombre:'Octubre'},
    {id:'11', nombre:'Noviembre'},
    {id:'12', nombre:'Diciembre'}
  ]
  public anioActual: any;
  public mesActual: any;
  public anios = [];
  public fecha = new Date();
  public loading_activas: boolean = false;
  public loading_finalizadas: boolean = false;
  public empty_finalizadas: boolean = true;
  public empty_activas: boolean = true;

  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
    this.sucursal_id = this.sucursales[0].id;
    this.getCuestionarios();
  }

  getCuestionarios() {
    this.http.get(this.ruta.get_ruta()+'cuestionarios/activos/sucursal/'+this.sucursal_id)
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
        this.loading_activas = true;
        for (var i = 0; i < this.Budget.length; ++i) {
          this.Budget[i].nombre = JSON.parse(this.Budget[i].cuestionario).nombre;
          if (this.Budget[i].estado == 0) {
            this.Budget[i].estado = 'En espera de agregar las preguntas a evaluar';
          } else if (this.Budget[i].estado == 1) {
            this.Budget[i].estado = 'En revisión';
          } else if (this.Budget[i].estado == 3) {
            this.Budget[i].estado = 'Rechazado';
          } else if (this.Budget[i].estado == 2) {
            this.Budget[i].estado = 'Publicado';
          }
          for (var j = 0; j < this.campanas.length; ++j) {
            if (this.campanas[j].id == this.Budget[i].campana_id) {
              this.Budget[i].campana = this.campanas[j].nombre;
            }
          }
          this.cuestionarios_activos.push(this.Budget[i]);
        }
        this.changeFinish();
      },
      msg => { 
        this.loading_activas = true;
      });
    },
    msg => { 
      this.loading_activas = true;
      if (msg.status == 404) {
        this.empty_activas = false;
        this.changeFinish();
      }
    });
  }

  changeFinish(){
    this.http.get(this.ruta.get_ruta()+'cuestionarios/finalizados/sucursal/'+this.sucursal_id)
    .toPromise()
    .then(
    data => {
      this.datos2 = data;
      this.Budget2 = this.datos2.cuestionarios;
      this.loading_finalizadas = true;
      for (var i = 0; i < this.Budget2.length; ++i) {
        this.Budget2[i].nombre = JSON.parse(this.Budget2[i].cuestionario).nombre;
        if (this.Budget2[i].estado == 0) {
          this.Budget2[i].estado = 'En espera de agregar las preguntas a evaluar';
        } else if (this.Budget2[i].estado == 1) {
          this.Budget2[i].estado = 'En revisión';
        } else if (this.Budget2[i].estado == 3) {
          this.Budget2[i].estado = 'Rechazado';
        } else if (this.Budget2[i].estado == 2) {
          this.Budget2[i].estado = 'Publicado';
        }
        for (var j = 0; j < this.campanas.length; ++j) {
          if (this.campanas[j].id == this.Budget2[i].campana_id) {
            this.Budget2[i].campana = this.campanas[j].nombre;
          }
        }
        this.cuestionarios_finalizados.push(this.Budget2[i]);
      }
      this.cuestionarios_finalizados.sort((a, b) => b.id - a.id);
    },
    msg => {
      this.loading_finalizadas = true; 
      if (msg.status == 404) {
        this.empty_finalizadas = false;
      }
    });
  }

  add_cuestionario(){
    this.router.navigate(['add_cuestionario'], {});
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
  }

  resetCamp(){
    this.campanas = [];
    this.cuestionarios = [];
    this.cuestionarios_activos = [];
    this.cuestionarios_finalizados = [];
    this.Budget = [];
    this.Budget2 = [];
    this.loading_activas = false;
    this.loading_finalizadas = false;
    this.empty_finalizadas = true;
    this.empty_activas = true;
  }

  showEdit(cuestionario){
    this.cuestionarioEdit = cuestionario;
    this.cuestionario.nombre = cuestionario.nombre;
    this.create_cuestionario.nombre = cuestionario.nombre;
    this.create_cuestionario.descripcion = cuestionario.descripcion;
    var question = JSON.parse(cuestionario.cuestionario);
    this.cuestionario.preguntas = question.preguntas;
    let index = question.preguntas.findIndex((item) => item.respuestas === '');
    if(index !== -1){
      this.question_open = question.preguntas[index].pregunta;
    }
  }

  /* CUESTIONARIOS */
  addQuestion(){
    if (this.question_unique != '') {
      if (this.answers!=undefined && this.answers.length > 0) {
        let index = this.cuestionario.preguntas.findIndex((item) => item.pregunta === this.question_unique);
        if(index !== -1){
          this.toastr.error('Ya agregaste esta pregunta, por favor ingresa otra nueva','Error', {
                timeOut: 5000
              });
        } else {
          this.cuestionario.preguntas.push({pregunta: this.question_unique, respuestas: this.answers});
          this.answers = [];
          this.question_unique = '';
          this.question_uniqueE = '';
          this.question_reference = '';
          this.answers_edit = [];
        }
      } else {
        this.toastr.error('Debes asignar respuestas a la pregunta','Error', {
              timeOut: 5000
            });
      }
    } else {
      this.toastr.error('Debes completar el campo pregunta','Error', {
            timeOut: 5000
        });
    }
  }

  editQuestion(question){
    this.question_uniqueE = question.pregunta;
    this.question_reference = question.pregunta;
    this.answers_edit = question.respuestas;
  }

  updateQuestion(){
    if (this.question_uniqueE != '') {
      if (this.answers_edit!=undefined && this.answers_edit.length > 0) {
        for (var i = 0; i < this.cuestionario.preguntas.length; ++i) {
          if (this.cuestionario.preguntas[i].pregunta === this.question_reference) {
            this.cuestionario.preguntas[i].pregunta = this.question_uniqueE;
            this.cuestionario.preguntas[i].respuestas = this.answers_edit;
            document.getElementById('editU-campaign').click();
            this.question_uniqueE = '';
            this.question_reference = '';
            this.answers_edit = [];
          }
        }
      } else {
        this.toastr.error('Debes asignar respuestas a la pregunta','Error', {
              timeOut: 5000
            });
      }
    } else {
      this.toastr.error('Debes completar el campo pregunta','Error', {
            timeOut: 5000
        });
    }
  }

  deleteUQuestion(){
    let index = this.cuestionario.preguntas.findIndex((item) => item.pregunta === this.question_reference);
    if(index !== -1){
      this.cuestionario.preguntas.splice(index, 1);
      this.question_uniqueE = '';
      this.question_reference = '';
      this.answers_edit = [];
    }
  }

  editOQuestion(){
    this.question_openE = this.question_open;
  }

  updateOQuestion(){
    if (this.question_openE != '') {
      this.question_open = this.question_openE;
      document.getElementById('editO-campaign').click();
    } else {
      this.toastr.error('Debes completar el campo pregunta','Error', {
            timeOut: 5000
        });
    }
  }

  deleteOQuestion(){
    let index = this.cuestionario.preguntas.findIndex((item) => item.pregunta === this.question_open);
    if(index !== -1){
      this.cuestionario.preguntas.splice(index, 1);
      this.question_open = '';
      this.question_openE = '';
    }
  }

  EditCuestionario() {
    this.cuestionario.nombre = this.create_cuestionario.nombre;
    if (this.cuestionario.nombre!='') {
      if (this.cuestionario.preguntas.length > 0) {     
        let index = this.cuestionario.preguntas.findIndex((item) => item.pregunta === this.question_open);
        if(index == -1){
          if (this.question_open != '') {
            this.cuestionario.preguntas.push({pregunta: this.question_open, respuestas: ''});
          }
        }
        document.getElementById('modal-editar').click();
        this.spinnerService.show();
        this.create_cuestionario.cuestionario = JSON.stringify(this.cuestionario);
        this.http.put(this.ruta.get_ruta()+'cuestionarios/'+this.cuestionarioEdit.id, this.create_cuestionario)
            .toPromise()
            .then(
            data => {
              this.spinnerService.hide();
              this.toastr.success('Cuestionario editado con éxito','Éxito', {
                timeOut: 5000
              });
              this.resetCamp();
              this.resetCampaign();
              this.getCuestionarios();
            },
            msg => {
              this.spinnerService.hide(); 
                this.toastr.error(msg.error.error,'Error', {
              timeOut: 5000
          });
        });
      } else {
        this.toastr.error('Debe asignar al menos una pregunta al cuestionario','Error', {
              timeOut: 5000
          });
          return false;
      }
    } else {
      this.toastr.error('Debe completar el campo nombre del cuestionario','Error', {
            timeOut: 5000
        });
        return false;
    }
  } 

  deleteCuestionario(cuestionarioDelete){
    this.spinnerService.show();
    this.http.delete(this.ruta.get_ruta()+'cuestionarios/'+cuestionarioDelete.id)
    .toPromise()
    .then(
    data => {
      this.spinnerService.hide();
      document.getElementById('modal-delete').click();
      this.resetCamp();
      this.resetCampaign();
      this.getCuestionarios();
      this.datos = data;
      this.toastr.success(this.datos.message, 'Éxito', {
        timeOut: 5000
      });
    },
    msg => { 
      this.spinnerService.hide();
      this.toastr.error(msg.error.error, 'Error', {
        timeOut: 5000
      });
    });
  } 

  update_sucursal(event){
    this.sucursal_id = event.target.value;
    this.campanas = [];
    this.Budget = [];
    this.campanas2 = [];
    this.Budget2 = [];
    this.cuestionarios_activos = [];
    this.cuestionarios_finalizados = [];
    this.loading_activas = false;
    this.loading_finalizadas = false;
    this.empty_finalizadas = true;
    this.empty_activas = true;
    this.getCuestionarios();
  }  
}
