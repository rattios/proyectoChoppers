import { Component, OnInit, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';
import { misPedidosComponent } from './mis-pedidos.component';

@Component({
  selector: 'app-mis-tabla-info',
  templateUrl: 'misTablaInfo.component.html'
})
export class misTablaInfoComponent {

  public verInfo=false;
  public loading=false;
  
  @Input() informacion:any;

  constructor(private http: HttpClient, private ruta: RutaService, private parent: misPedidosComponent) {

  }

   ngOnInit(): void {
      console.log(this.informacion);
      if(this.informacion!=undefined) {
       this.productList = this.informacion;
       this.filteredItems = this.productList;
       this.init();
      }
    }
    aceptarSolicitud(id){
      console.log(id);
      var aceptar={
        estado:1
      }
      this.http.put(this.ruta.get_ruta()+'pedidos/'+this.informacion.id,aceptar)
           .toPromise()
           .then(
           data => {
             console.log(data);
             this.parent.reset();
            },
           msg => { 
             console.log(msg);
             alert('Ha ocurrido un error!');
           });     
    }
    finalizarSolicitud(id){
      console.log(id);
      var aceptar={
        estado:2
      }
      this.http.put(this.ruta.get_ruta()+'pedidos/'+this.informacion.id,aceptar)
           .toPromise()
           .then(
           data => {
             console.log(data);
             this.parent.reset();
            },
           msg => { 
             console.log(msg);
             alert('Ha ocurrido un error!');
           });     
    }
    cancelarSolicitud(id){
      console.log(id);
      var aceptar={
        estado:4
      }
      this.http.put(this.ruta.get_ruta()+'pedidos/'+this.informacion.id,aceptar)
           .toPromise()
           .then(
           data => {
             console.log(data);
             this.parent.reset();
            },
           msg => { 
             console.log(msg);
             alert('Ha ocurrido un error!');
           });     
    }
    ver(item){

      console.log(item);
      this.informacion=item;
      this.verInfo=true;
    }
    volver(){
      this.verInfo=false;
    }

     //-------------------------------------------------------------------------------------------------------------------------
   
   filteredItems : any;
   productList : any;
   pages : number = 4;
   pageSize : number = 10;
   pageNumber : number = 0;
   currentIndex : number = 1;
   items: any;
   pagesIndex : Array<number>;
   pageStart : number = 1;
   inputName : string = '';

   init(){
         this.currentIndex = 1;
         this.pageStart = 1;
         this.pages = 4;

         this.pageNumber = parseInt(""+ (this.filteredItems.length / this.pageSize));
         if(this.filteredItems.length % this.pageSize != 0){
            this.pageNumber ++;
         }
    
         if(this.pageNumber  < this.pages){
               this.pages =  this.pageNumber;
         }
       
         this.refreshItems();
         console.log("this.pageNumber :  "+this.pageNumber);
   }
   FilterByName(){
      this.filteredItems = [];
      if(this.inputName != ""){
            for (var i = 0; i < this.productList.length; ++i) {

              if (this.productList[i].stock==this.inputName) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].precio==this.inputName) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].codigo==this.inputName) {
                 this.filteredItems.push(this.productList[i]);
              }
            }
      }else{
         this.filteredItems = this.productList;
      }
      console.log(this.filteredItems);
      this.init();
   }
   fillArray(): any{
      var obj = new Array();
      for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
                  obj.push(index);
      }
      return obj;
   }
 refreshItems(){
               this.items = this.filteredItems.slice((this.currentIndex - 1)*this.pageSize, (this.currentIndex) * this.pageSize);
               this.pagesIndex =  this.fillArray();
   }
   prevPage(){
      if(this.currentIndex>1){
         this.currentIndex --;
      } 
      if(this.currentIndex < this.pageStart){
         this.pageStart = this.currentIndex;
      }
      this.refreshItems();
   }
   nextPage(){
      if(this.currentIndex < this.pageNumber){
            this.currentIndex ++;
      }
      if(this.currentIndex >= (this.pageStart + this.pages)){
         this.pageStart = this.currentIndex - this.pages + 1;
      }
 
      this.refreshItems();
   }
    setPage(index : number){
         this.currentIndex = index;
         this.refreshItems();
    }
}
