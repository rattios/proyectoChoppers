import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { RutaService } from '../../services/ruta.service';

@Component({
  selector: 'app-mis-info',
  templateUrl: 'misInfo.component.html'
})
export class misInfoComponent {
  public prov: any;
  public pedidos: any;
  public productos: any;
  public proveedor: any='';
  public showTransferencia=false;
  public aTransferir:any;

  @Input() informacion:any;

  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
      console.log(this.informacion);
      if(this.informacion!=undefined) {
       
      }
    }

    
}
