import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'proveedores.component.html'
})
export class ProveedoresComponent {
  public prov: any;
  public stock: any;
  public proveedores: any;
  public productos: any;
  public proveedor: any='';
  public loading=true;
  public verDatos=false;
  public success=false;
  public fail=false;
  public crear=false;
  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
      this.loading=true;
      this.http.get(this.ruta.get_ruta()+'proveedores')
           .toPromise()
           .then(
           data => {
             this.prov=data;
           	  this.proveedores=this.prov.proveedores;
              console.log(this.proveedores);
              this.productList = this.proveedores;
              this.filteredItems = this.productList;
              this.init();
              this.loading=false;
            },
           msg => { 
             console.log(msg);
             this.loading=false;
           });

      this.http.get(this.ruta.get_ruta()+'stock')
           .toPromise()
           .then(
           data => {
             this.prov=data;
               this.stock=this.prov.productos;
              console.log(this.stock);
              for (var i = 0; i < this.stock.length; i++) {
                if(this.stock.habilitado=="SI"){
                  this.stock.habilitado=true;
                }
              }
              this.productList2 = this.stock;
              this.filteredItems2 = this.productList2;
              this.init2();
              this.loading=false;
            },
           msg => { 
             console.log(msg);
             this.loading=false;
           });
    }

    ver(item){
      if(item==0) {
        this.proveedor={
          calificacion:null,
          cuit:"",
          email:"",
          estado:"",
          fax:"",
          habilitado:"NO",
          habilitado2: false,
          motivo:"",
          id:0,
          nombre_fantacia:"",
          productos:[],
          razon_social:"",
          telefono:"",
          direccion: "",
          formaPago: "",
          telefonos: []
        };
        this.crear=true;
        console.log(item);
      }else{
        this.proveedor=item;
        this.crear=false;
        console.log(item);
      }
    	
      this.verDatos=true;
    }
    volver(){
      this.verDatos=false;
    }
    agregar(item){
      if(!this.checkProductos(item)) {
       this.proveedor.productos.push(item);
      }
    }
    checkProductos(item){
      var band=false;
      for (var i = 0; i < this.proveedor.productos.length; i++) {
        if(this.proveedor.productos[i].id==item.id) {
          band=true;
        }
      }
      return band;
    }
    eliminarProducto(it){
      for (var i = 0; i < this.proveedor.productos.length; i++) {
        if(this.proveedor.productos[i].id==it.id) {
          this.proveedor.productos.splice(i, 1);
        }
      }
    }

    crearProveedor(){
      
      var send={
        productos:JSON.stringify(this.proveedor.productos),
        razon_social:this.proveedor.razon_social,
        nombre_fantacia: this.proveedor.nombre_fantacia,
        cuit: this.proveedor.cuit,
        telefono: this.proveedor.telefono,
        email: this.proveedor.email,
        estado: this.proveedor.estado,
        habilitado: this.proveedor.habilitado,
        motivo: this.proveedor.motivo,
        direccion: this.proveedor.direccion,
        formaPago: this.proveedor.formaPago,
        telefonos: JSON.stringify(this.proveedor.telefonos)
      }
      this.http.post(this.ruta.get_ruta()+'proveedores',send)
           .toPromise()
           .then(
           data => {
            
              console.log(data);
              this.success=true;
              setTimeout(() => {  
                this.success=false;
              }, 4000);

              this.loading=true;
              this.http.get(this.ruta.get_ruta()+'proveedores')
                   .toPromise()
                   .then(
                   data => {
                     this.prov=data;
                       this.proveedores=this.prov.proveedores;
                      console.log(this.proveedores);
                      this.productList = this.proveedores;
                      this.filteredItems = this.productList;
                      this.init();
                      this.loading=false;
                    },
                   msg => { 
                     console.log(msg);
                     this.loading=false;
                   });
             

            },
           msg => { 
             console.log(msg);
             this.fail=true;
              setTimeout(() => {  
                this.fail=false;
              }, 4000);

           });
    }



    editar(){
      
      var send={
        productos:JSON.stringify(this.proveedor.productos),
        razon_social:this.proveedor.razon_social,
        nombre_fantacia: this.proveedor.nombre_fantacia,
        cuit: this.proveedor.cuit,
        telefono: this.proveedor.telefono,
        email: this.proveedor.email,
        estado: this.proveedor.estado,
        habilitado: this.proveedor.habilitado,
        motivo: this.proveedor.motivo,
        direccion: this.proveedor.direccion,
        formaPago: this.proveedor.formaPago,
        telefonos: JSON.stringify(this.proveedor.telefonos)
      }
      console.log(send);
      this.http.put(this.ruta.get_ruta()+'proveedores/'+this.proveedor.id,send)
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

              if (this.productList[i].razon_social.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].cuit.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].telefono.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList[i].email.toUpperCase().indexOf(this.inputName.toUpperCase())>=0) {
                 this.filteredItems.push(this.productList[i]);
              }
            }

            // this.productList.forEach(element => {
            //     if(element.nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0){
            //       this.filteredItems.push(element);
            //    }
            // });
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

    //-------------------------------------------------------------------------------------------------------------------------
   
   filteredItems2 : any;
   productList2 : any;
   pages2 : number = 4;
   pageSize2 : number = 10;
   pageNumber2 : number = 0;
   currentIndex2 : number = 1;
   items2: any;
   pagesIndex2 : Array<number>;
   pageStart2 : number = 1;
   inputName2 : string = '';

   init2(){
         this.currentIndex2 = 1;
         this.pageStart2 = 1;
         this.pages2 = 4;

         this.pageNumber2 = parseInt(""+ (this.filteredItems2.length / this.pageSize2));
         if(this.filteredItems2.length % this.pageSize2 != 0){
            this.pageNumber2 ++;
         }
    
         if(this.pageNumber2  < this.pages2){
               this.pages2 =  this.pageNumber2;
         }
       
         this.refreshItems2();
         console.log("this.pageNumber :  "+this.pageNumber2);
   }
   FilterByName2(){
      this.filteredItems2 = [];
      if(this.inputName2 != ""){
            for (var i = 0; i < this.productList2.length; ++i) {

              if (this.productList2[i].stock==this.inputName2) {
                 this.filteredItems2.push(this.productList2[i]);
              }else if (this.productList2[i].nombre.toUpperCase().indexOf(this.inputName2.toUpperCase())>=0) {
                 this.filteredItems2.push(this.productList2[i]);
              }else if (this.productList2[i].precio==this.inputName2) {
                 this.filteredItems.push(this.productList[i]);
              }else if (this.productList2[i].codigo==this.inputName2) {
                 this.filteredItems2.push(this.productList2[i]);
              }
              
            }

            // this.productList.forEach(element => {
            //     if(element.nombre.toUpperCase().indexOf(this.inputName.toUpperCase())>=0){
            //       this.filteredItems.push(element);
            //    }
            // });
      }else{
         this.filteredItems2 = this.productList2;
      }
      //console.log(this.filteredItems2);
      this.init2();
   }
   fillArray2(): any{
      var obj2 = new Array();
      for(var index2 = this.pageStart2; index2< this.pageStart2 + this.pages2; index2 ++) {
                  obj2.push(index2);
      }
      return obj2;
   }
 refreshItems2(){
               this.items2 = this.filteredItems2.slice((this.currentIndex2 - 1)*this.pageSize2, (this.currentIndex2) * this.pageSize2);
               this.pagesIndex2 =  this.fillArray();
               console.log(this.items2);
   }
   prevPage2(){
      if(this.currentIndex2>1){
         this.currentIndex2 --;
      } 
      if(this.currentIndex2 < this.pageStart2){
         this.pageStart2 = this.currentIndex2;
      }
      this.refreshItems2();
   }
   nextPage2(){
      if(this.currentIndex2 < this.pageNumber2){
            this.currentIndex2 ++;
      }
      if(this.currentIndex2 >= (this.pageStart2 + this.pages2)){
         this.pageStart2 = this.currentIndex2 - this.pages2 + 1;
      }
 
      this.refreshItems2();
   }
    setPage2(index : number){
         this.currentIndex2 = index;
         this.refreshItems2();
    }
}
