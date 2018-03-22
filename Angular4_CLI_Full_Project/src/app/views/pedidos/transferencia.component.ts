import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: 'transferencia.component.html'
})
export class transferenciaComponent {
  public prov: any;
  public pedidos: any;
  public productos: any;
  public proveedor: any='';

  public departamentos:any;
  @Input() producto:any;

  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
      console.log(this.producto);
      this.http.get(this.ruta.get_ruta()+'pedidos/ubicar/'+this.producto.id)
           .toPromise()
           .then(
           data => {
             console.log(data);
             this.departamentos=data;
             this.departamentos=this.departamentos.departamentos;
            },
           msg => { 
             console.log(msg);
             
           });
    }

    
    transferir(item){
      console.log(item);
      
      var send = {
        cantidad_transf:this.producto.pivot.cantidad,
        stock_id:item.stock_id,
        departamento_id:item.departamento_id
      }
      console.log(send);
      this.http.post(this.ruta.get_ruta()+'transferencias',send)
           .toPromise()
           .then(
           data => {
             console.log(data);
             alert('Exito');
            },
           msg => { 
             console.log(msg);
             alert(msg.error);
           });
    }
}
