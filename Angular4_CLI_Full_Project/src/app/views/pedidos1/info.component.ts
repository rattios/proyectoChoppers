import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';

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

  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
      console.log(this.informacion);
      if(this.informacion!=undefined) {
       
      }
    }

    
    setProductos(){
      console.log('asdasd');
    }
}
