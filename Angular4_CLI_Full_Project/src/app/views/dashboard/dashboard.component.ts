import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SharedService } from '../../services/sucursales.service';
import { Observable, Observer } from 'rxjs';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public campanas: any = [];
  public datosCampaign: any;
  public Campaign: any = [];
  public cuestionarios: any = [];
  public datosBudget: any;
  public Budget: any = [];

  public sucursales:any = [];
  public sucursal_id: any;
  public campana_id: any;
  public cuestionario_id: any;

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
    
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
    this.sucursal_id = this.sucursales[0].id;
    this.getCampaign();
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
      this.cuestionarios = [];
      this.getCampaign();
  }

  getCampaign() {
      this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas')
      .toPromise()
      .then(
      data => {
        this.datosCampaign = data;
        this.Campaign = this.datosCampaign.sucursal.campanas;
        if (this.Campaign != '') {
          for (var i = 0; i < this.Campaign.length; ++i) {
            if (this.Campaign[i].estado != 0) {
              this.campanas.push(this.Campaign[i]);
            }
          }
            this.campana_id = this.campanas[0].id;
            this.getBudget();
          } else {
          this.toastr.info('No hay campañas asignadas a esta sucursal', 'Aviso', {
            timeOut: 5000
          });
          }
      },
        msg => {
            this.toastr.error(msg.error.error,'Error', {
          timeOut: 5000
      });
        });
  }

  getBudget() {
      this.http.get(this.ruta.get_ruta()+'cuestionarios')
      .toPromise()
      .then(
      data => {
        this.datosBudget = data;
        this.Budget = this.datosBudget.cuestionarios;
        if (this.Budget != '') {
          for (var i = 0; i < this.Budget.length; ++i) {
            if (this.Budget[i].campana_id == this.campana_id) {
              this.cuestionarios.push(this.Budget[i]);
            }
          }
            if (this.cuestionarios.length > 0) {
              this.cuestionario_id = this.cuestionarios[0].id;
            }
          } else {
            this.toastr.info('No hay cuestionarios asignados a esta campaña', 'Aviso', {
              timeOut: 5000
            });
          }
      },
        msg => {
            this.toastr.error(msg.error.error,'Error', {
          timeOut: 5000
      });
        });
  }


  setCampaign(ev){
    this.cuestionarios = [];
    this.cuestionario_id = '';
    for (var i = 0; i < this.campanas.length; ++i) {
      if (this.campanas[i].id == ev.target.value) {
        this.campana_id = ev.target.value;
        this.getBudget();
      }
    }
  }

  setCuestionario(ev){
    for (var i = 0; i < this.cuestionarios.length; ++i) {
      if (this.cuestionarios[i].id == ev.target.value) {
        this.cuestionario_id = ev.target.value;
      }
    }
  }
}