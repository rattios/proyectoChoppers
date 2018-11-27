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
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';
import * as moment from 'moment';

@Component({
  templateUrl: 'ver-campanas.component.html',
  styleUrls: ['./ver-campanas.component.css','./foundation-theme.scss']
})
export class verCampanasComponent {

  public editCampaignForm: FormGroup;
  public myMinVar = 0;
  public MinVar = 0;
  public MaxVar = 100;
  public categorias: any;
  public preferences = [];
  public estados: any = [];
  public selected_estados = [];
  public datos2: any;
  public municipios: any = [];
  public selected_municipios = [];
  public datos3: any;
  public colonias: any = [];
  public selected_colonias = [];
  public sucursales:any = [];
  public sucursal_id: any; 
  public formErrors = {
    'nombre': '',
    'num_cuestionarios':'',
    'reembolso':''
  };

  public campanas_activas: any[] = [];
  public campanas_finalizadas: any[] = [];
  public selected: any = [];
  public datos: any;
  public datos1: any;
  public isSelected = false;
  public campaignDelete: any = {};
  public campaignEdit: any = {};

  public date = new Date();
  public date2 = new Date();
  public options: DatepickerOptions = {
    displayFormat: 'DD/MM/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,
    locale: esLocale,
    minDate: this.date
  };
  public options2: DatepickerOptions = {
    displayFormat: 'DD/MM/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,
    locale: esLocale,
    minDate: this.date2
  };
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
    this.date.setDate(this.date.getDate() - 1);
    this.date2.setDate(this.date2.getDate() - 1);
    this.editCampaignForm = this.builder.group({
      nombre: [''],
      genero: ['Todos'],
      item: [''],
      f_inicio: [new Date()],
      f_fin: [new Date()],
      campana_id: [''],
      edad: ['0-100'],
      item_preference: [''],
      categorias: [''],
      estados: [''],
      municipios: [''],
      localidades: ['']
    });
    this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
    this.sucursal_id = this.sucursales[0].id;
    this.getCampaigns();
    this.http.get(this.ruta.get_ruta()+'categorias')
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.categorias = this.datos.categorias;
      this.page();
    },
    msg => { 
      this.categorias = [];
      this.page();
    });

    this.anioActual = this.fecha.getFullYear();
    var mes = this.fecha.getMonth();
    this.mesActual = this.months[mes].id;
    this.anios.push({id:this.anioActual, nombre:this.anioActual});
    for (var i = 1; i < 5; i++) {
      this.anios.push({id:this.anioActual - i, nombre:this.anioActual - i});
    }
  }

  getCampaigns() {
    this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas/activas')
    .toPromise()
    .then(
    data => {
      console.log(data);
      this.datos1 = data;
      this.campanas_activas = this.datos1.sucursal.campanas;
      this.loading_activas = true;
      if (this.campanas_activas.length == 0) {
        this.toastr.info('No tienes campañas activas asociadas a esta sucursal', 'Aviso', {
          timeOut: 5000
        });
        this.empty_activas = false;
      } else {
        this.campanas_activas.sort((a, b) => b.id - a.id);
      }
      this.changeFinish(this.mesActual,this.anioActual);
    },
    msg => { 
      this.loading_activas = true;
      this.empty_activas = true;
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

  add_campana(){
    this.router.navigate(['add_campana'], {});
  }

  AgeFinish(ev){
    var rageAge = ev.from +"-"+ ev.to;
    this.editCampaignForm.patchValue({edad: rageAge});
  }

  changeGender(type){
    this.editCampaignForm.patchValue({genero: type});
  }

  onChangeMonth(event){
    this.loading_finalizadas = false;
    this.empty_finalizadas = true;
    this.campanas_finalizadas = [];
    this.changeFinish(event,this.anioActual);
  }

  changePreferences(e,item){
      item.checked =! item.checked;
      if(item.checked){
        let index = this.preferences.findIndex((item1) => item1.id === item.id);
        if(index == -1){
          this.preferences.push(item);
        }
      } else {
        let index1 = this.preferences.findIndex((item2) => item2.id === item.id);
        if(index1 !== -1){
          this.preferences.splice(index1, 1);
        }
      }
  }

  PreferenceRemoved(event){
    let index = this.preferences.findIndex((item) => item.id === event.id);
    if(index !== -1){
      this.preferences.splice(index, 1);
    }
    for (var i = 0; i < this.categorias.length; ++i) {
      if (this.categorias[i].id == event.id) {
        this.categorias[i].checked = false;
      } 
    }
  }

  page(){
      this.http.get(this.ruta.get_ruta() + 'mx/get/estados')
      .toPromise()
      .then(
        data => {
          this.datos1 = data;
          this.estados = this.datos1.estados; 
        },
        msg => {
          this.estados = [];
          this.toastr.error('No se pudo cargar las estados, intenta de nuevo','Error', {
            timeOut: 5000
        });
      });
  }

  changeState(e,item){
      item.checked =! item.checked;
      if(item.checked){
        let index = this.selected_estados.findIndex((item1) => item1.id === item.id);
        if(index == -1){
          this.selected_estados.push(item);
          this.setMunicipios(item.id, false);
        }
      } else {
        let index1 = this.selected_estados.findIndex((item2) => item2.id === item.id);
        if(index1 !== -1){
          this.selected_estados.splice(index1, 1);
          this.setMunicipios(item.id, true);
        }
      }
  }

  StateRemoved(event){
    let index = this.selected_estados.findIndex((item) => item.id === event.id);
    if(index !== -1){
      this.selected_estados.splice(index, 1);
      this.setMunicipios(event.id, true);
    }
    for (var i = 0; i < this.estados.length; ++i) {
      if (this.estados[i].id == event.id) {
        this.estados[i].checked = false;
      } 
    }
  }

  setMunicipios(estado_id, exist){
    if (exist) {
          var i = this.municipios.length;
      while (i--) {
          if (this.municipios[i].estado_id == estado_id) {
              this.municipios.splice(i, 1);
          }
      }
    } else {
      this.http.get(this.ruta.get_ruta() + 'mx/get/municipios?estado_id='+estado_id)
        .toPromise()
        .then(
          data => {
            this.datos2 = data;
            if (this.datos2 != '') {
              for (var i = 0; i < this.datos2.municipios.length; ++i) {
                this.municipios.push(this.datos2.municipios[i]);
              }
            }
          },
          msg => {
            this.toastr.error('No se pudo cargar los municipios, intenta de nuevo','Error', {
              timeOut: 5000
            });
        });
    }   
  }

  changeCity(e,item){
      item.checked =! item.checked;
      if(item.checked){
        let index = this.selected_municipios.findIndex((item1) => item1.id === item.id);
        if(index == -1){
          this.selected_municipios.push(item);
          this.setColonias(item.id, false);
        }
      } else {
        let index1 = this.selected_municipios.findIndex((item2) => item2.id === item.id);
        if(index1 !== -1){
          this.selected_municipios.splice(index1, 1);
          this.setColonias(item.id, true);
        }
      }
  }

  CityRemoved(event){
    let index = this.selected_municipios.findIndex((item) => item.id === event.id);
    if(index !== -1){
      this.selected_municipios.splice(index, 1);
      this.setColonias(event.id, true);
    }
    for (var i = 0; i < this.municipios.length; ++i) {
      if (this.municipios[i].id == event.id) {
        this.municipios[i].checked = false;
      } 
    }
  }

  setColonias(municipio_id, exist){
    if (exist) {
          var i = this.colonias.length;
      while (i--) {
          if (this.colonias[i].estado_id == municipio_id) {
              this.colonias.splice(i, 1);
          }
      }
    } else {
      this.http.get(this.ruta.get_ruta() + 'mx/get/localidades?municipio_id='+municipio_id)
        .toPromise()
        .then(
          data => {
            this.datos3 = data;
            if (this.datos3 != '') {
              for (var i = 0; i < this.datos3.localidades.length; ++i) {
                this.colonias.push(this.datos3.localidades[i]);
              }
            }
          },
          msg => {
            this.toastr.error('No se pudo cargar las colonias, intenta de nuevo','Error', {
              timeOut: 5000
            });
        });
    }   
  }

  changeColonia(e,item){
      item.checked =! item.checked;
      if(item.checked){
        let index = this.selected_colonias.findIndex((item1) => item1.id === item.id);
        if(index == -1){
          this.selected_colonias.push(item);
        }
      } else {
        let index1 = this.selected_colonias.findIndex((item2) => item2.id === item.id);
        if(index1 !== -1){
          this.selected_colonias.splice(index1, 1);
        }
      }
  }

  ColoniaRemoved(event){
    let index = this.selected_colonias.findIndex((item) => item.id === event.id);
    if(index !== -1){
      this.selected_colonias.splice(index, 1);
      this.setColonias(event.id, true);
    }
    for (var i = 0; i < this.colonias.length; ++i) {
      if (this.colonias[i].id == event.id) {
        this.colonias[i].checked = false;
      } 
    }
  }

  resetCampaign(){
    this.isSelected = false;
    this.campaignDelete = {};
  }

  showEdit(campaign){
    this.campaignEdit = campaign;
    this.editCampaignForm.patchValue({campana_id: campaign.id});
    this.editCampaignForm.patchValue({nombre: campaign.nombre});
    this.editCampaignForm.patchValue({genero: campaign.genero});
    this.editCampaignForm.patchValue({edad: campaign.edad});
    var inicio = new Date(campaign.f_inicio);
    inicio.setMinutes(inicio.getMinutes() + inicio.getTimezoneOffset());
    this.editCampaignForm.patchValue({f_inicio: inicio});
    var fin = new Date(campaign.f_fin);
    fin.setMinutes(fin.getMinutes() + fin.getTimezoneOffset());
    this.editCampaignForm.patchValue({f_fin: new Date(fin)});
    if (campaign.edad != null) {
      let toArray =  campaign.edad.split("-");
      this.MinVar = toArray[0];
      this.MaxVar = toArray[1];
    }
    if (campaign.categorias != '') {
      this.preferences = JSON.parse(campaign.categorias);
      for (var i = 0; i < this.categorias.length; ++i) {
        for (var j = 0; j < this.preferences.length; ++j) {
          if (this.categorias[i].id == this.preferences[j].id) {
            this.categorias[i].checked = true;
          } 
        }
      }
    } else {
      this.preferences = [];
    }
    if (campaign.estados != '') {
      this.selected_estados = JSON.parse(campaign.estados);
      for (var i = 0; i < this.selected_estados.length; ++i) {
        this.setMunicipios(this.selected_estados[i].id, false);
        for (var j = 0; j < this.estados.length; ++j) {
          if (this.selected_estados[i].id == this.estados[j].id) {
            this.estados[j].checked = true;
          } 
        }
      }
    } else {
      this.selected_estados = [];
    }
    if (campaign.municipios != '') {
      this.selected_municipios = JSON.parse(campaign.municipios);
      for (var i = 0; i < this.selected_municipios.length; ++i) {
        this.setColonias(this.selected_municipios[i].id, false);
        for (var j = 0; j < this.municipios.length; ++j) {
          if (this.selected_municipios[i].id == this.municipios[j].id) {
            this.municipios[j].checked = true;
          } 
        }
      }
    } else {
      this.selected_municipios = [];
    }
    if (campaign.localidades != '') {
      this.selected_colonias = JSON.parse(campaign.localidades);
      for (var i = 0; i < this.selected_colonias.length; ++i) {
        for (var j = 0; j < this.colonias.length; ++j) {
          if (this.selected_colonias[i].id == this.colonias[j].id) {
            this.colonias[j].checked = true;
          } 
        }
      }
    } else {
      this.selected_colonias = [];
    }
  }

  EditCampaign() {
    if (moment(this.editCampaignForm.value.f_fin).format("YYYY-MM-DD") >= moment(this.editCampaignForm.value.f_inicio).format("YYYY-MM-DD")) {
      document.getElementById('modal-editar').click();
      this.spinnerService.show();
      this.editCampaignForm.patchValue({categorias: JSON.stringify(this.preferences)});
      this.editCampaignForm.patchValue({estados: JSON.stringify(this.selected_estados)});
      this.editCampaignForm.patchValue({municipios: JSON.stringify(this.selected_municipios)});
      this.editCampaignForm.patchValue({localidades: JSON.stringify(this.selected_colonias)});

      this.http.put(this.ruta.get_ruta()+'campanas/'+this.editCampaignForm.value.campana_id, this.editCampaignForm.value)
      .toPromise()
      .then(
      data => {
          this.spinnerService.hide();
          this.getCampaigns();
          this.toastr.success('Campaña editada con éxito','Éxito', {
            timeOut: 5000
          });
      },
      msg => {
        this.spinnerService.hide(); 
          this.toastr.error(msg.error.error,'Error', {
          timeOut: 5000
        });
      });
    } else {
      this.toastr.error('La Fecha Fin de Campaña no puede ser menor a la Fecha Inicio','Error', {
        timeOut: 5000
      });
    }
  } 

  deleteCampaign(campaignDelete){
    this.spinnerService.show();
    this.http.delete(this.ruta.get_ruta()+'campanas/'+campaignDelete.id)
    .toPromise()
    .then(
    data => {
      this.spinnerService.hide();
      document.getElementById('modal-delete').click();
      this.getCampaigns();
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

  update_sucursal(event){
    this.sucursal_id = event.target.value;
    this.campanas_activas = [];
    this.campanas_finalizadas = [];
    this.loading_activas = false;
    this.loading_finalizadas = false;
    this.empty_finalizadas = true;
    this.empty_activas = true;
    this.getCampaigns();
  }  
}
