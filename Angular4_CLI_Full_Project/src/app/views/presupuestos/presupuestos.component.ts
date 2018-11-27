import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { RutaService } from '../../services/ruta.service';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SharedService } from '../../services/sucursales.service';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/operator/toPromise';


@Component({
  templateUrl: 'presupuestos.component.html',
  styleUrls: ['./presupuestos.component.css']
})
export class PresupuestosComponent {

  public sucursales: any[];
  public selected: any = [];
  public datos: any;
  public datos1: any;
  public isSelected = false;
  public campaignDelete: any = {};
  public campaignEdit: any = {};
  public presupuesto_max = 0;
  public presupuesto = 0;
  public gastado = 0;
  public editCampanaForm: FormGroup;
  formErrors = {
    'nombre': '',
    'presupuesto': ''
  };
  public preferences: any;
  public selected_estados: any;
  public selected_municipios: any;
  public selected_colonias: any;
  public sucursal_id: any;
  public param_notification = {
    empresa_id: localStorage.getItem('shoppers_usuario_id'),
    nombre_campana: ''
  }
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
  public loading_pendientes: boolean = false;
  public empty_finalizadas: boolean = true;
  public empty_activas: boolean = true;
  public empty_pendientes: boolean = true;
  public campanas: any[] = [];
  public campanas_activas: any[] = [];
  public campanas_finalizadas: any[] = [];
  public campanas_pendientes: any[] = [];

  constructor(private http: HttpClient, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.editCampanaForm = this.builder.group({
      presupuesto: [0],
      presupuesto_max: [0, [Validators.required]],
      add_presupuesto: [0],
      estado: [1]
    });
    this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
    this.sucursal_id = this.sucursales[0].id;
    this.getCampaign();
    this.editCampanaForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

    this.anioActual = this.fecha.getFullYear();
    var mes = this.fecha.getMonth();
    this.mesActual = this.months[mes].id;
    this.anios.push({id:this.anioActual, nombre:this.anioActual});
    for (var i = 1; i < 5; i++) {
      this.anios.push({id:this.anioActual - i, nombre:this.anioActual - i});
    }
  }

  update_sucursal(event){
    this.sucursal_id = event.target.value;
    this.campanas = [];
    this.campanas_activas = [];
    this.campanas_finalizadas = [];
    this.campanas_pendientes = [];
    this.loading_activas = false;
    this.loading_finalizadas = false;
    this.loading_pendientes = false;
    this.empty_finalizadas = true;
    this.empty_activas = true;
    this.empty_pendientes = true;
    this.getCampaign();
  }  

  getCampaign() {
    this.campanas = [];
    this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas/activas')
    .toPromise()
    .then(
    data => {
      this.datos1 = data;
      this.campanas = this.datos1.sucursal.campanas;
      this.loading_activas = true;
      this.loading_pendientes = true;
      this.campanas.sort((a, b) => b.id - a.id);
      for (var i = 0; i < this.campanas.length; ++i) {
        this.campanas[i].presupuesto_max = (this.campanas[i].presupuesto_max).toFixed(2);
        this.campanas[i].gastado = (this.campanas[i].saldo).toFixed(2);
        this.campanas[i].disponible = (this.campanas[i].presupuesto).toFixed(2);
        if (this.campanas[i].presupuesto_max == 0) {
          this.campanas_pendientes.push(this.campanas[i]);
        } else {
          this.campanas_activas.push(this.campanas[i]);
        }
      }
      if (this.campanas_activas.length == 0) {
        this.empty_activas = false;
      }
      if (this.campanas_pendientes.length == 0) {
        this.empty_pendientes = false;
      }
      this.changeFinish(this.mesActual,this.anioActual)
    },
    msg => { 
      this.loading_activas = true;
      this.loading_pendientes = true;
      this.toastr.warning(msg.error.error, 'Aviso', {
        timeOut: 5000
      });
    });
  }

  changeFinish(month,year){
    this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas/finalizadas?mes='+month+'&anio='+year)
    .toPromise()
    .then(
    data => {
      this.datos1 = data;
      this.campanas_finalizadas = this.datos1.sucursal.campanas;
      this.loading_finalizadas = true;
      if (this.campanas_finalizadas.length == 0) {
        this.empty_finalizadas = false;
      } else {
        for (var i = 0; i < this.campanas_finalizadas.length; ++i) {
          this.campanas_finalizadas[i].presupuesto_max = (this.campanas_finalizadas[i].presupuesto_max).toFixed(2);
          this.campanas_finalizadas[i].gastado = (this.campanas_finalizadas[i].saldo).toFixed(2);
          this.campanas_finalizadas[i].disponible = (this.campanas_finalizadas[i].presupuesto).toFixed(2);
        }
        this.campanas_finalizadas.sort((a, b) => b.id - a.id);
      }
    },
    msg => {
      this.loading_finalizadas = true; 
      this.empty_finalizadas = true;
      this.toastr.warning(msg.error.error, 'Aviso', {
        timeOut: 5000
      });
    });
  }

  onChangeMonth(event){
    this.loading_finalizadas = false;
    this.empty_finalizadas = true;
    this.campanas_finalizadas = [];
    this.changeFinish(event,this.anioActual);
  }

  resetCampaign(){
    this.isSelected = false;
    this.editCampanaForm = this.builder.group({
      presupuesto: [0],
      add_presupuesto: [0],
      presupuesto_max: [0, [Validators.required]],
      estado: [1]
    });
    this.selected = [];
    this.campaignDelete = {};
    this.campaignEdit = {};
  }

  resetCamp(){
    this.campanas = [];
    this.campanas_activas = [];
    this.campanas_finalizadas = [];
    this.campanas_pendientes = [];
    this.loading_activas = false;
    this.loading_finalizadas = false;
    this.loading_pendientes = false;
    this.empty_finalizadas = true;
    this.empty_activas = true;
    this.empty_pendientes = true;
  }

  deleteCampaign(campaignDelete){
    this.spinnerService.show();
    this.http.delete(this.ruta.get_ruta()+'campanas/'+campaignDelete.id)
    .toPromise()
    .then(
    data => {
      this.spinnerService.hide();
      document.getElementById('modal-delete').click();
      this.resetCamp();
      this.getCampaign();
      this.resetCampaign();
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

  showEdit(campaign){
    this.campaignEdit = campaign;
    this.editCampanaForm.patchValue({presupuesto_max: campaign.presupuesto_max});
    this.editCampanaForm.patchValue({presupuesto: campaign.presupuesto});
    this.preferences = JSON.parse(this.campaignEdit.categorias);
    this.selected_estados = JSON.parse(this.campaignEdit.estados);
    this.selected_municipios = JSON.parse(this.campaignEdit.municipios);
    this.selected_colonias = JSON.parse(this.campaignEdit.localidades);
    this.param_notification.nombre_campana = this.campaignEdit.nombre;
    this.gastado = this.campaignEdit.saldo;
  }

  EditCampaign() {
    if (this.editCampanaForm.valid) {
      var disponible = this.editCampanaForm.value.presupuesto + this.editCampanaForm.value.add_presupuesto;
      var disponible_max = parseFloat(this.editCampanaForm.value.presupuesto_max) + parseFloat(this.editCampanaForm.value.add_presupuesto);
      console.log(disponible_max);
      this.editCampanaForm.patchValue({presupuesto_max: disponible_max});
      this.editCampanaForm.patchValue({presupuesto: disponible});
      this.spinnerService.show();
      this.http.put(this.ruta.get_ruta() + 'campanas/' + this.campaignEdit.id, this.editCampanaForm.value)
      .toPromise()
      .then(
      data => {
        this.spinnerService.hide();
        document.getElementById('modal-editar').click();
        this.resetCamp();
        this.resetCampaign();
        this.getCampaign();
        this.datos = data;
        this.toastr.success('Presupuesto asignado con éxito', 'Éxito', {
          timeOut: 5000
        });
        this.http.post(this.ruta.get_ruta() + 'notificaciones/crear/campanas', this.param_notification)
        .toPromise()
        .then(
        data => {
          this.datos = data;
          this.toastr.success(this.datos.message, 'Éxito', {
            timeOut: 5000
          });
        },
        msg => { 
          console.log(msg.error.error);
        });
      },
      msg => { 
        this.spinnerService.hide();
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 5000
        });
      });
    } else {
      this.validateAllFormFields(this.editCampanaForm);
      this.toastr.error('¡Faltan datos para asignar el presupuesto!', 'Error', {
        timeOut: 5000
      });
    }
  }

  onValueChanged(data?: any) {
    if (!this.editCampanaForm) { return; }
    const form = this.editCampanaForm;
    for (const field in this.formErrors) { 
      const control = form.get(field);
      this.formErrors[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += true;
          console.log(key);
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
