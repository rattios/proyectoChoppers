import { Component, ElementRef } from '@angular/core';
import { CommonModule, NgClass} from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';
import { SharedService } from '../../services/sucursales.service';
import { NgxPermissionsService } from 'ngx-permissions';

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
  public menu: string = 'si';
  public sucursales = [];
  public imagen: string = 'assets/img/avatars/p.png';

  constructor(private sharedService: SharedService, private router: Router,private el: ElementRef,private http: HttpClient, private ruta: RutaService, private permissionsService: NgxPermissionsService) { 
    this.sharedService.sucursalData.subscribe((data: any) => {
      if (localStorage.getItem('shoppers_tipo_usuario') == '2') {
        this.imagen = localStorage.getItem('shoppers_imagen');
        if (this.imagen == '') {
          this.imagen = 'assets/img/avatars/flats.png';
        }
      } else {
        this.imagen = 'assets/img/avatars/p.png';
      }
    });
  }

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
    this.nombre = localStorage.getItem('shoppers_nombre');
    this.menu = localStorage.getItem('shoppers_menu');

    if (localStorage.getItem('shoppers_tipo_usuario') == '2') {
      this.imagen = localStorage.getItem('shoppers_imagen');
      if (this.imagen == '') {
        this.imagen = 'assets/img/avatars/flats.png';
      }
    } else {
      this.imagen = 'assets/img/avatars/p.png';
    }
  }


  logout(){
    this.permissionsService.flushPermissions();
    localStorage.setItem('shoppers_permis','');
    localStorage.setItem('shoppers_token', '');
    localStorage.setItem('shoppers_nombre', '');
    localStorage.setItem('shoppers_usuario_id', '');
    localStorage.setItem('shoppers_tipo_usuario', '');
    localStorage.setItem('shoppers_email', '');
    localStorage.setItem('shoppers_imagen', '');
    localStorage.setItem('shoppers_menu', 'si');
    localStorage.setItem('shopper_idSucursal', '');
    localStorage.setItem('shoppers_sucursales', '');
    localStorage.setItem('shopper_permisos', '');
    localStorage.setItem('shoppers_empresa_id','');
    localStorage.setItem('shoppers_id', '');
  }
}
