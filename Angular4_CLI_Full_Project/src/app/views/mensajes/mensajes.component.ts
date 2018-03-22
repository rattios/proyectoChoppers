import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';

import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: 'mensajes.component.html'
})
export class MensajesComponent {

  public info:any;
  public mensaje:any;
  public mensajes:any=[];

  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {

      this.http.get(this.ruta.get_ruta()+'mensajes/departamento/'+localStorage.getItem('tecprecinc_departamento_id'))
         .toPromise()
         .then(
         data => {
           console.log(data);
           this.mensaje=data;
           this.mensaje=this.mensaje.mensajes;
           this.productList = this.mensaje;
           this.filteredItems = this.productList;
           this.init();
           
          },
         msg => { 
           console.log(msg);
           //alert(msg.error);
         });
    }

    verMensaje(item){
      console.log(item);
      this.info=item;
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
