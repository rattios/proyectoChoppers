import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'pedidos.component.html'
})
export class pedidosComponent {
  public prov: any;
  public stock: any;
  public productos: any;
  public productosSeleccionados: any=[];
  public proveedor: any='';
  public departamento=localStorage.getItem('tecprecinc_nombre');
  public template:'http://localhost/template.gif';
  public loading=true;
  public success=false;
  public fail=false;
  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
      this.loading=true;
      this.http.get(this.ruta.get_ruta()+'stock')
           .toPromise()
           .then(
           data => {
             this.prov=data;
           	  this.stock=this.prov.productos;
              console.log(this.stock);
              this.productList = this.stock;
              this.filteredItems = this.productList;
              this.init();
              this.loading=false;
            },
           msg => { 
             console.log(msg);
              this.loading=false;
           });
    }

    setProductos(item){
      if(!this.checkProductos(item)) {
        item.cantidad=1;
        item.producto_id=item.id;
        this.productosSeleccionados.push(item);
      }
      
      console.log(this.productosSeleccionados);
    }
    checkProductos(item){
      var band=false;
      for (var i = 0; i < this.productosSeleccionados.length; i++) {
        if(this.productosSeleccionados[i].id==item.id) {
          band=true;
        }
      }
      return band;
    }
    delProductos(item){
      for (var i = 0; i < this.productosSeleccionados.length; i++) {
        if(this.productosSeleccionados[i].id==item.id) {
          this.productosSeleccionados.splice(i, 1);
        }
      }
    }
    enviar(){
      if(this.productosSeleccionados.length>0) {
        var enviar = {
          usuario_id: localStorage.getItem('tecprecinc_usuario_id'),
          solicitud: JSON.stringify(this.productosSeleccionados),
          estado: 0
        }
        console.log(enviar);

        setTimeout(() => {
          this.http.post(this.ruta.get_ruta()+'pedidos',enviar)
           .toPromise()
           .then(
           data => {
             console.log(data);
              
              this.vaciar();
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
        }, 1000);
       } 
    }
    vaciar(){
      this.productosSeleccionados=[];
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
