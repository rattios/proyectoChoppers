import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'stock.component.html'
})
export class stockComponent {
  public prov: any;
  public stock: any;
  public productos: any;
  public proveedor: any='';
  public loading=true;
  public verProduc=false;
  public producSelec:any;
  public categoria: any;
  public categorias: any;
  public rubros: any;
  public tipos: any;
  public departamentos: any;
  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
     this.loading=true;
      this.http.get(this.ruta.get_ruta()+'todos')
           .toPromise()
           .then(
           data => {
             this.prov=data;
           	  this.stock=this.prov.productos;

              this.categorias=this.prov.categorias;
              this.rubros=this.prov.rubros;
              this.tipos=this.prov.tipos;
              this.departamentos=this.prov.departamentos;

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

    ver(item){
      if(item==0) {
        this.producSelec={
          categoria_id:0,
          codigo:"",
          departamentos:[],
          id:0,
          nombre:"",
          precio:0,
          rubro_id:0,
          stock:0,
          stock_min:0,
          tipo_id:0
        };
        console.log(item);
        this.verProduc=true;
      }else{
    	  this.producSelec=item;
        this.verProduc=true;
      }
    }
    atras(){
      this.verProduc=false;
    }
    getCategorias(){
      return this.categorias;
    }
    getTipos(){
      return this.tipos;
    }
    getRubros(){
      return this.rubros;
    }
    getDepartamentos(){
      return this.departamentos;
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
