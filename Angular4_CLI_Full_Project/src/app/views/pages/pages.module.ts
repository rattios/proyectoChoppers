import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { PrincipalComponent } from './principal.component';
import { UICarouselModule } from "ui-carousel";
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [ 
	CommonModule,
	HttpClientModule,
	FormsModule,
  PagesRoutingModule,
  UICarouselModule
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    PrincipalComponent
  ]
})
export class PagesModule { }
