import { Component, OnInit, Input } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { RutaService } from '../../services/ruta.service';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';
import { ProveedoresComponent } from './proveedores.component';

@Component({
  selector: 'app-add-proveedores',
  templateUrl: 'addProveedores.component.html'
})
export class addProveedoresComponent {
  
  @Input() informacion:any;

  constructor(private http: HttpClient, private ruta: RutaService, private parent: ProveedoresComponent) {

  }

   ngOnInit(): void {
      console.log(this.informacion);
      
    }
    
}
