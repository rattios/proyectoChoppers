import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { TarifasComponent } from './tarifas.component';
import { TarifasRoutingModule } from './tarifas-routing.module';

@NgModule({
  imports: [
    TarifasRoutingModule,
    HttpClientModule,
    CommonModule,
	FormsModule,
	AlertModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ TarifasComponent ]
})
export class TarifasModule { }
