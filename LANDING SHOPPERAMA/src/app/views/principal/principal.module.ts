import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { PrincipalComponent } from './principal.component';
import { PrincipalRoutingModule } from './principal-routing.module';
import { UICarouselModule } from "ui-carousel";

@NgModule({
  imports: [
    PrincipalRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    UICarouselModule,
    CommonModule,
    FormsModule,
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ 
  	PrincipalComponent
  ]
})
export class PrincipalModule { }
