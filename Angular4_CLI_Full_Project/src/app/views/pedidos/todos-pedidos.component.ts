import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'todos-pedidos.component.html'
})
export class todosPedidosComponent {
  public prov: any;
  public pedidos: any;
  public pedidos0: any=[];
  public pedidos1: any=[];
  public pedidos2: any=[];
  public pedidos3: any=[];
  public productos: any;
  public informacion: any;
  public proveedor: any='';
  public loading=true;
  public verInfo=false;
  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {

      this.http.get(this.ruta.get_ruta()+'pedidos')
           .toPromise()
           .then(
           data => {
             this.prov=data;
           	  this.pedidos=this.prov.pedidos;
              console.log(this.pedidos);
              for (var i = 0; i < this.pedidos.length; ++i) {
                if(this.pedidos[i].estado==0) {
                  this.pedidos0.push(this.pedidos[i]);
                }else if(this.pedidos[i].estado==1) {
                  this.pedidos1.push(this.pedidos[i]);
                }else if(this.pedidos[i].estado==2) {
                  this.pedidos2.push(this.pedidos[i]);
                }else if(this.pedidos[i].estado==3) {
                  this.pedidos3.push(this.pedidos[i]);
                }
              }
              this.loading=false;
            },
           msg => { 
             console.log(msg);
             this.loading=false;
             alert('Ha ocurrido un error!');
           });
    }

    reset(){
      this.loading=true;
      this.pedidos0=[];
      this.pedidos1=[];
      this.pedidos2=[];
      this.pedidos3=[];
      this.http.get(this.ruta.get_ruta()+'pedidos')
           .toPromise()
           .then(
           data => {
             this.prov=data;
               this.pedidos=this.prov.pedidos;
              console.log(this.pedidos);
              for (var i = 0; i < this.pedidos.length; ++i) {
                if(this.pedidos[i].estado==0) {
                  this.pedidos0.push(this.pedidos[i]);
                }else if(this.pedidos[i].estado==1) {
                  this.pedidos1.push(this.pedidos[i]);
                }else if(this.pedidos[i].estado==2) {
                  this.pedidos2.push(this.pedidos[i]);
                }else if(this.pedidos[i].estado==3) {
                  this.pedidos3.push(this.pedidos[i]);
                }
              }
              this.loading=false;
            },
           msg => { 
             console.log(msg);
             this.loading=false;
             alert('Ha ocurrido un error!');
           });
    }

    
}
