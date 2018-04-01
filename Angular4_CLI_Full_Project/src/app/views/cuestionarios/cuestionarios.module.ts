import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

import { CuestionariosComponent } from './cuestionarios.component';
import { CuestionariosRoutingModule } from './cuestionarios-routing.module';

@NgModule({
  imports: [
    CuestionariosRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [ CuestionariosComponent ]
})
export class CuestionariosModule { }
