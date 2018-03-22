import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ProveedoresComponent } from './proveedores.component';
import { addProveedoresComponent } from './addProveedores.component';
import { ProveedoresRoutingModule } from './proveedores-routing.module';

@NgModule({
  imports: [
    ProveedoresRoutingModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
	AlertModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [ 
  	ProveedoresComponent,
  	addProveedoresComponent
    ]
})
export class ProveedoresModule { }
