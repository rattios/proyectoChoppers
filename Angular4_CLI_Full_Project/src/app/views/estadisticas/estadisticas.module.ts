import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

import { EstadisticasComponent } from './estadisticas.component';
import { EstadisticasRoutingModule } from './estadisticas-routing.module';

@NgModule({
  imports: [
    EstadisticasRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [ EstadisticasComponent ]
})
export class EstadisticasModule { }
