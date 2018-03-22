import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';

import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: 'categorias.component.html'
})
export class CategoriasComponent {

  public categoria: any;
  public categorias: any;
  public rubros: any;
  public tipos: any;
  public productos: any;
  public proveedor: any='';
  public aEditar:any= [];
  public success=false;
  public fail=false;
  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {

      this.http.get(this.ruta.get_ruta()+'fullcategorias')
           .toPromise()
           .then(
           data => {
           	  this.categoria=data;
              
              this.categorias=this.categoria.categorias;
              this.rubros=this.categoria.rubros;
              this.tipos=this.categoria.tipos;

              for (var i = 0; i < this.categorias.length; i++) {
                this.categorias[i].categoria_id=this.categorias[i].id;
                this.categorias[i].habilitado=true;
              }
              console.log(this.categoria);
            },
           msg => { 
             console.log(msg);
           });
    }

    editar(id){
    	console.log(id);
      for (var i = 0; i < this.categorias.length; i++) {
        if (this.categorias[i].id==id) {
          console.log(id);
          this.categorias[i].habilitado=false;
          this.aEditar.push(this.categorias[i]);
        }
      }
    }

  guardarCambios(){
    console.log(this.aEditar);
    var send = {
      categorias: JSON.stringify(this.aEditar)
    }
    this.http.put(this.ruta.get_ruta()+'categorias',send)
           .toPromise()
           .then(
           data => {
              console.log(data);

              this.success=true;
              setTimeout(() => {  
                this.success=false;
              }, 4000);
            },
           msg => { 
             console.log(msg);
             this.fail=true;
              setTimeout(() => {  
                this.fail=false;
              }, 4000);
           });
  }
}
