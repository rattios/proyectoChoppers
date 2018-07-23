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
          var cam=this.campanas;
          console.log(cam);
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
  public cuesti:any=[];
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
          this.cuesti=this.cuestionarios;
          /*for (var i = 0; i < this.cuesti.length; i++) {

            this.cuesti[i].cuestionario=JSON.parse(this.cuesti[i].cuestionario);
          }*/
          this.getRespuesta(this.cuesti[0].id);
          //this.cuesti.cuestionario=JSON.parse(this.cuesti.cuestionario);
          console.log(this.cuesti);
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
    console.log(ev);
    for (var i = 0; i < this.cuestionarios.length; ++i) {
      if (this.cuestionarios[i].id == ev.target.value) {
        this.cuestionario_id = ev.target.value;
        console.log(this.cuestionario_id);
        this.getRespuesta(this.cuestionario_id);
      }
    }
  }

  public resp:any=[];
  public preguntas:any=[];
  getRespuesta(id){
     this.preguntas=[];
    this.http.get(this.ruta.get_ruta()+'respuestas/'+id)
      .toPromise()
      .then(
      data => {
        this.resp=data;
        this.resp=this.resp.respuesta;
        console.log(this.resp);

        for (var i = 0; i < this.resp[0].cuestionario.length; i++) {
          if(this.repRespuesta(this.resp[0].cuestionario[i].pregunta)) {
            this.preguntas.push({
              pregunta:this.resp[0].cuestionario[i].pregunta,
              respuestas:this.resp[0].cuestionario[i].respuestas
              });
          }
        }

        for (var l = 0; l < this.preguntas.length; l++) {
          this.preguntas[l].barChartLabels=[];
          this.preguntas[l].barChartData=[];
          for (var m = 0; m < this.preguntas[l].respuestas.length; m++) {
            this.preguntas[l].respuestas[m].n=0;
          }
        }
        //console.log(this.preguntas);
        this.calculoGraficos();
      },msg => {
            //this.toastr.error(msg.error.error,'Error', {timeOut: 5000
      });
  }

  repRespuesta(pregunta){
    for (var i = 0; i < this.preguntas.length; i++) {
      if(this.preguntas[i].pregunta==pregunta || pregunta=='abierta') {
        return false;
      }
    }
    return true;
  }

  calculoGraficos(){
      for (var i = 0; i < this.resp.length; i++) {
        for (var j = 0; j < this.resp[i].cuestionario.length; j++) {
          //for (var k = 0; k < this.resp[i].cuestionario[j].respuestas.length; k++) {
            for (var l = 0; l < this.preguntas.length; l++) {
              if(this.preguntas[l].pregunta==this.resp[i].cuestionario[j].pregunta) {
                for (var m = 0; m < this.preguntas[l].respuestas.length; m++) {
                  if(this.preguntas[l].respuestas[m].nombre==this.resp[i].cuestionario[j].rpta) {
                    this.preguntas[l].respuestas[m].n++;
                  }
                }
              }
            }
          //}
        }
      } 

      console.log(this.preguntas); 
      this.construirGraficos();
  }

  construirGraficos(){
   //public barChartLabels: string[] = ['2006', '2007', '2008'];
   //public barChartData: any[] = [{data: [65, 59, 80], label: 'Series A'}];
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
  }


}