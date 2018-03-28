import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';

@NgModule({
  imports: [
    UsuariosRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [ UsuariosComponent ]
})
export class UsuariosModule { }
