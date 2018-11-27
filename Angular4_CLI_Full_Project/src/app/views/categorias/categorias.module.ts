import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

import { CategoriasComponent } from './categorias.component';
import { CategoriasRoutingModule } from './categorias-routing.module';

@NgModule({
  imports: [
    CategoriasRoutingModule,
    HttpClientModule,
    CommonModule,
	FormsModule,
	AlertModule.forRoot(),
    ReactiveFormsModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ CategoriasComponent ]
})
export class CategoriasModule { }
