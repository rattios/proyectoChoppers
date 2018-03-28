import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'usuarios.component.html'
})
export class UsuariosComponent {

  public empleados:any;
  public usuario:any={
       camp_crear:0,
       camp_editar:0,
       camp_ver:0,
       camp_eliminar:0,
       cuest_crear:0,
       cuest_eidtar:0,
       cuest_ver:0,
       cuest_eliminar:0,
       est_crear:0,
       est_editar:0,
       est_ver:0, 
       est_eliminar:0,
       empleado_id:0,
       email:'',
       password:'',
       nombre:''
      };
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
   crearPermisos(){
     //
     this.usuario={
       camp_crear:0,
       camp_editar:0,
       camp_ver:0,
       camp_eliminar:0,
       cuest_crear:0,
       cuest_eidtar:0,
       cuest_ver:0,
       cuest_eliminar:0,
       est_crear:0,
       est_editar:0,
       est_ver:0, 
       est_eliminar:0,
       empleado_id:0,
       email:'',
       password:'',
       nombre:''
      }
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
