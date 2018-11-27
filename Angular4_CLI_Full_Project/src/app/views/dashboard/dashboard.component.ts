import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

 @ViewChild('slider') public slider: ElementRef;
 @ViewChild('panel') public panel: ElementRef;
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

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2006', '2007', '2008'];
  public barChartType = 'horizontalBar';
  public barChartLegend = true;

  public barChartData: any[] = [
    {data: [65, 59, 80], label: 'Series A'}
  ];
  public tipo: string = '0';
  public permiss: any = {};
  public cuesti:any=[];
  public presupuesto: any = 0;
  public presupuesto_max: any = 0;
  public saldo: any = 0;
  public estadisticasAdmin: any = {
    countCampanas: 0,
    countClientes: 0,
    countCuestionarios: 0,
    countEmpresas: 0,
    countRespuestas: 0
  }
    
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.anioActual = this.fecha.getFullYear();
    var mes = this.fecha.getMonth();
    this.mesActual = this.months[mes].id;
    this.anios.push({id:this.anioActual, nombre:this.anioActual});
    for (var i = 1; i < 5; i++) {
      this.anios.push({id:this.anioActual - i, nombre:this.anioActual - i});
    }
    this.tipo = localStorage.getItem('shoppers_tipo_usuario');
    this.showpanelUser();
    if (this.tipo != '4') {
      this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
      this.sucursal_id = this.sucursales[0].id;
      this.getCampaign();
    } else {
      this.getAdmin();
    }
  }

  update_sucursal(event){
      this.sucursal_id = event.target.value;
      this.campanas = [];
      this.cuestionarios = [];
      this.getCampaign();
  }

  showpanelUser(){
    let permiss = localStorage.getItem('shopper_permisos');
    if (this.tipo == '3' && this.permiss != '') {
      this.permiss = JSON.parse(permiss);
    }
  }

   getAdmin() {
      this.http.get(this.ruta.get_ruta()+'dashboard/estadisticas/admin')
      .toPromise()
      .then(
      data => {
        console.log(data);
        this.estadisticasAdmin = data;
      },
        msg => {
            this.toastr.error(msg.error.error,'Error', {
          timeOut: 5000
      });
        });
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
            var cam=this.campanas;
            console.log(cam);
            this.campana_id = this.campanas[0].id;
            this.presupuesto = this.campanas[0].presupuesto;
            this.presupuesto_max = this.campanas[0].presupuesto_max;
            this.saldo = this.campanas[0].saldo;
            this.getBudget(this.campanas[0].id);
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
  };

  getBudget(campana) {
    this.http.get(this.ruta.get_ruta()+'cuestionarios/campana/'+campana)
    .toPromise()
    .then(
    data => {
      this.datosBudget = data;
      this.cuestionarios = this.datosBudget.cuestionarios;
      if (this.cuestionarios.length > 0) {
        this.getRespuesta(this.cuestionarios[0].id);
        this.cuestionario_id = this.cuestionarios[0].id;
      }
    },
    msg => {
      this.toastr.error(msg.error.error,'Error', {
        timeOut: 5000
      });
    });
  };

  setCampaign(ev){
    this.ressetTarjetas();
    this.cuestionarios = [];
    this.cuestionario_id = '';
    for (var i = 0; i < this.campanas.length; ++i) {
      if (this.campanas[i].id == ev.target.value) {
        this.campana_id = ev.target.value;
        this.presupuesto = this.campanas[i].presupuesto;
        this.presupuesto_max = this.campanas[i].presupuesto_max;
        this.saldo = this.campanas[i].saldo;
        this.getBudget(ev.target.value);
      }
    }
  }

  setCuestionario(ev){
    this.ressetTarjetas();
    for (var i = 0; i < this.cuestionarios.length; ++i) {
      if (this.cuestionarios[i].id == ev.target.value) {
        this.cuestionario_id = ev.target.value;
        this.getRespuesta(this.cuestionario_id);
      }
    }
  }

  public resp:any=[];
  public preguntas:any=[];
  public cuest_diponibles:any = 0;
  public cuest_respondidos:any = 0;
  public saldo_disponible:any = 0;
  public saldo_pagado:any = 0;
  public aux:any;
  public respuestas_abiertas:any=[];

  getRespuesta(id){
    console.log(id);
    this.ressetTarjetas();
    this.http.get(this.ruta.get_ruta()+'respuestas/filter/'+id+'?mes='+this.mesActual+'&anio='+this.anioActual)
      .toPromise()
      .then(
      data => {
        console.log(data);
        this.aux=data;
        this.resp=data;
        this.resp=this.resp.respuesta;
        this.cuest_diponibles = this.aux.cuest_diponibles;
        this.cuest_respondidos = this.aux.cuest_respondidos;
        this.saldo_disponible = this.aux.saldo_disponible;
        this.saldo_pagado = this.aux.saldo_pagado;

        if (this.resp.length > 0) {
          for (var i = 0; i < this.resp[0].cuestionario.length; i++) {
            if (this.resp[0].cuestionario[i].respuestas != '') {
              if(this.repRespuesta(this.resp[0].cuestionario[i].pregunta)) {
                this.preguntas.push({
                  pregunta:this.resp[0].cuestionario[i].pregunta,
                  respuestas:this.resp[0].cuestionario[i].respuestas
                });
              }
            }
          }
        }

        for (var l = 0; l < this.preguntas.length; l++) {
          this.preguntas[l].barChartLabels=[];
          this.preguntas[l].barChartData=[];
          for (var m = 0; m < this.preguntas[l].respuestas.length; m++) {
            this.preguntas[l].respuestas[m].n=0;
          }
        }
        this.calculoGraficos();
      },msg => {
        //this.spinnerService.hide();
      });
  }

  ressetTarjetas(){
    this.cuest_diponibles = null;
    this.cuest_respondidos = null;
    this.saldo_disponible = null;
    this.saldo_pagado = null;
    this.preguntas = [];
    this.respuestas_abiertas = [];
  }

  repRespuesta(pregunta){
    for (var i = 0; i < this.preguntas.length; i++) {
      if(this.preguntas[i].pregunta==pregunta || this.preguntas[i].respuestas=='') {
        return false;
      }
    }
    return true;
  }

  calculoGraficos(){
      for (var i = 0; i < this.resp.length; i++) {
        for (var j = 0; j < this.resp[i].cuestionario.length; j++) {
          for (var l = 0; l < this.preguntas.length; l++) {
            if(this.preguntas[l].pregunta==this.resp[i].cuestionario[j].pregunta) {
              for (var m = 0; m < this.preguntas[l].respuestas.length; m++) {
                if(this.preguntas[l].respuestas[m].nombre==this.resp[i].cuestionario[j].rpta) {
                  this.preguntas[l].respuestas[m].n++;
                }
              }
            }
          }

          if (this.resp[i].cuestionario[j].respuestas == '') {
            this.respuestas_abiertas.push({rpta:this.resp[i].cuestionario[j].rpta});
          }
        }
      }  
      this.construirGraficos();
  }

  construirGraficos(){
   var barChartDataAux:any=[];
   for (var l = 0; l < this.preguntas.length; l++) {
       barChartDataAux=[];
      for (var m = 0; m < this.preguntas[l].respuestas.length; m++) {
        this.preguntas[l].barChartLabels.push(this.preguntas[l].respuestas[m].nombre);
        barChartDataAux.push(this.preguntas[l].respuestas[m].n);
      }
      this.preguntas[l].barChartData.push({
        data:barChartDataAux,
        label: 'Respuestas'
      });
    }
    //this.spinnerService.hide();
  }

  onChangeMonth(event){
    this.mesActual = event;
    this.getRespuesta(this.cuestionario_id);
  }

  onChangeAnio(event){
    this.anioActual = event;
    this.getRespuesta(this.cuestionario_id);
  }

  public onPreviousSearchPosition(): void {
    this.panel.nativeElement.scrollLeft -= this.slider.nativeElement.offsetWidth/2;
  }

  public onNextSearchPosition(): void {
    var aux_left = this.panel.nativeElement.scrollLeft;
    this.panel.nativeElement.scrollLeft += this.slider.nativeElement.offsetWidth/2;
  }

}