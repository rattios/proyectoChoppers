import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';
import { UICarouselModule } from "ui-carousel";
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    LoginRoutingModule,
    CommonModule,
    FormsModule,
    UICarouselModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ LoginComponent ]
})
export class LoginModule { }
