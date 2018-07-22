import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { PrincipalComponent } from './principal.component';
import { PrincipalRoutingModule } from './principal-routing.module';
import { UICarouselModule } from "ui-carousel";

@NgModule({
  imports: [
    PrincipalRoutingModule,
    ChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    UICarouselModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ 
  	PrincipalComponent
  ]
})
export class PrincipalModule { }
