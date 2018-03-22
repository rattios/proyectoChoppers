import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';

import { CategoriasComponent } from './categorias.component';
import { CategoriasRoutingModule } from './categorias-routing.module';

@NgModule({
  imports: [
    CategoriasRoutingModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
	FormsModule,
	AlertModule.forRoot()
  ],
  declarations: [ CategoriasComponent ]
})
export class CategoriasModule { }
