import { Component, ElementRef } from '@angular/core';
import { CommonModule, NgClass} from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeader {
  public nombre;
  public noLeidos:any=0;
  public nMensajes:any=0;
  public mensaje:any;
  public mensajes:any=[];

  constructor(private router: Router,private el: ElementRef,private http: HttpClient, private ruta: RutaService) { }

  //wait for the component to render completely
  ngOnInit(): void {
    var nativeElement: HTMLElement = this.el.nativeElement,
    parentElement: HTMLElement = nativeElement.parentElement;
    // move all children out of the element
    while (nativeElement.firstChild) {
      parentElement.insertBefore(nativeElement.firstChild, nativeElement);
    }
    // remove the empty element(the host)
    parentElement.removeChild(nativeElement);
    this.nombre= localStorage.getItem('tecprecinc_nombre');

    this.http.get(this.ruta.get_ruta()+'mensajes/departamento/'+localStorage.getItem('tecprecinc_departamento_id'))
         .toPromise()
         .then(
         data => {
           console.log(data);
           this.mensaje=data;
           this.mensaje=this.mensaje.mensajes;
           for (var i = 0; i < this.mensaje.length; i++) {
             if(i<=10) {
               this.mensajes.push(this.mensaje[i]);
               this.nMensajes++;
             }
             
           }
           for (var i = 0; i < this.mensaje.length; i++) {
             if(this.mensaje[i].estado==1) {
               this.noLeidos++;
             }
           }
          },
         msg => { 
           console.log(msg);
           //alert(msg.error);
         });

  }

  reload(){
    
    this.http.get(this.ruta.get_ruta()+'mensajes/departamento/'+localStorage.getItem('tecprecinc_departamento_id'))
         .toPromise()
         .then(
         data => {
           this.mensaje=[];
            this.mensajes=[];
            this.nMensajes=0;
            this.noLeidos=0;
           console.log(data);
           this.mensaje=data;
           this.mensaje=this.mensaje.mensajes;
           for (var i = 0; i < this.mensaje.length; i++) {
             if(i<=7) {
               this.mensajes.push(this.mensaje[i]);
               this.nMensajes++;
             }
             
           }
           for (var i = 0; i < this.mensaje.length; i++) {
             if(this.mensaje[i].estado==1) {
               this.noLeidos++;
             }
           }
          },
         msg => { 
           console.log(msg);
           //alert(msg.error);
         });
  }

  ir(){
    this.router.navigateByUrl('/mensajes');
  }

  logout(){
    localStorage.setItem('tecprecinc_token', '');
    localStorage.setItem('tecprecinc_nombre', '');
    localStorage.setItem('tecprecinc_departamento_id', '');
    localStorage.setItem('tecprecinc_nombre', '');
    localStorage.setItem('tecprecinc_rol', '');
  }
}
