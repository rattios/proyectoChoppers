import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';

import { MensajesComponent } from './mensajes.component';
import { MensajesRoutingModule } from './mensajes-routing.module';

@NgModule({
  imports: [
    MensajesRoutingModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
	FormsModule,
	AlertModule.forRoot()
  ],
  declarations: [ MensajesComponent ]
})
export class MensajesModule { }
