import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';
import { stockComponent } from './stock.component';

@Component({
  selector: 'app-info',
  templateUrl: 'info.component.html'
})
export class infoComponent {
  public prov: any;
  public pedidos: any;
  public productos: any;
  public proveedor: any='';

  @Input() informacion:any;
  public categorias:any;
  public tipos:any;
  public rubros:any;
  public departamentos:any;
  public permisos_departs:any=[];
  public isCrear=false;
  constructor(private http: HttpClient, private ruta: RutaService, private parent: stockComponent) {

  }

   ngOnInit(): void {
      console.log(this.informacion);
      if(this.informacion.id==0) {
        this.isCrear=true;
      }else{
        this.isCrear=false;
      }
      this.categorias=this.parent.getCategorias();
      this.tipos=this.parent.getTipos();
      this.rubros=this.parent.getRubros();
      this.departamentos=this.parent.getDepartamentos();
      if(this.informacion!=undefined) {
       
      }
      for (var i = 0; i < this.departamentos.length; i++) {
        this.departamentos[i].bandera=false;
        for (var j = 0; j < this.informacion.departamentos.length; j++) {
          if(this.informacion.departamentos[j].id==this.departamentos[i].id) {
            this.departamentos[i].bandera=true;
            this.permisos_departs.push({"id":this.informacion.departamentos[j].id});
          }
        }
      }
    }

    volver(){
      this.parent.atras();
    }
    checkAdd(id){
     console.log(id);
     if(this.permisos_departs.length>0) {
       var b=0;
       for (var i = 0; i < this.permisos_departs.length; i++) {
         if(this.permisos_departs[i].id==id) {
           b=1;
           this.permisos_departs.splice(i, 1);
           this.delDepart(id);
         }
       }
       if(b==0) {
         this.addDepart(id);
       }
     }else if(this.permisos_departs.length==0){
       this.addDepart(id);
     }
     
     console.log(this.permisos_departs);
     console.log(this.informacion);
    }

    addDepart(id){
      this.permisos_departs.push({"id":id});
      this.informacion.departamentos.push({"id":id});
    }
    delDepart(id){
      for (var i = 0; i < this.informacion.departamentos.length; i++) {
        if(this.informacion.departamentos[i].id==id) {
          this.informacion.departamentos.splice(i, 1);
        }
          
      }
    }

    editar(){
      this.informacion.permisos_departs=JSON.stringify(this.permisos_departs);
      console.log(this.informacion);
      this.http.put(this.ruta.get_ruta()+'stock/'+this.informacion.id,this.informacion)
       .toPromise()
       .then(
       data => {
          console.log(data);

          alert('exito');
        },
       msg => { 
         console.log(msg);
         alert(JSON.stringify(msg));
       });
    }
}
