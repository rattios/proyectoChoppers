import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'usuarios.component.html'
})
export class UsuariosComponent {

  public empleados:any;
  constructor(private http: HttpClient, private ruta: RutaService) { }

   //http://shopper.internow.com.mx/shoppersAPI/public/empleados
   ngOnInit(): void {
     this.http.get(this.ruta.get_ruta()+'empleados')
           .toPromise()
           .then(
           data => {
             this.empleados=data;
             this.empleados=this.empleados.empleados;
             console.log(this.empleados);
            },
           msg => { 
             console.log(msg);
           });
   }

   changePermiso(e,id){
     console.log(e.target.value);
     console.log(id);
     console.log(this.empleados);
     var send:any;
     for (var i = 0; i < this.empleados.length; i++) {
       if(this.empleados[i].id==id) {
         send=this.empleados[i];
         send.email=this.empleados[i].usuario.email;
       }
     }
     console.log(send);
     this.http.put(this.ruta.get_ruta()+'empleados/'+id,send)
           .toPromise()
           .then(
           data => {
             console.log(data);
            },
           msg => { 
             console.log(msg);
           });
   }
}
