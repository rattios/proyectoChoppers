import { Component, OnInit, Input } from '@angular/core';
import {CommonModule, NgClass} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { RutaService } from '../../services/ruta.service';

@Component({
  selector: 'app-trans-info',
  templateUrl: 'transInfo.component.html'
})
export class transInfoComponent {


  @Input() informacion:any;

  constructor(private http: HttpClient, private ruta: RutaService) {

  }

   ngOnInit(): void {
      console.log(this.informacion);
      
      if(this.informacion!=undefined) {
       
      }
    }

  aceptar(item){
    console.log(item);

    var send = {
      
    }

    this.http.post(this.ruta.get_ruta()+'transferencias/aprobar/'+item.id,send)
         .toPromise()
         .then(
         data => {
           console.log(data);
           item.estado=2;
           item.estado2='Aprobada';
           alert('Exito');
          },
         msg => { 
           console.log(msg);
           alert(msg.error);
         });
  }
    
}
