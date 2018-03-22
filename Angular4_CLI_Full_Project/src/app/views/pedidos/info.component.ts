import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
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

    
    picking(item){
      item.departamento=this.informacion.usuario.departamento;
      console.log(item);
      //alert(JSON.stringify(item));
      var send = {
        picking: JSON.stringify(item)
      }

      this.http.post(this.ruta.get_ruta()+'pedidos/picking',send)
           .toPromise()
           .then(
           data => {
             console.log(data);
             var rec:any;
             rec=data;
             console.log(this.informacion);
             console.log(rec);
             console.log(rec.picking);
             for (var i = 0; i < this.informacion.solicitud.length; i++) {
               if(this.informacion.solicitud[i].id==rec.picking.id) {
                 this.informacion.solicitud[i]=rec.picking;
               }
             }
            },
           msg => { 
             console.log(msg);
             
           });
    }

    transferencia(item){
      this.aTransferir=item;
      this.showTransferencia=true;
    }
}
