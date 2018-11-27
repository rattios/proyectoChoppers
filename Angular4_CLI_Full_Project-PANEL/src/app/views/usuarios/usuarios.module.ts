import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosRoutingModule } from './usuarios-routing.module';

@NgModule({
  imports: [
    UsuariosRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ UsuariosComponent ]
})
export class UsuariosModule { }
