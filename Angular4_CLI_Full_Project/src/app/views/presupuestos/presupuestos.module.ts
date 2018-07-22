import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { PresupuestosComponent } from './presupuestos.component';
import { PresupuestosRoutingModule } from './presupuestos-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    PresupuestosRoutingModule,
    ChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [ 
  	PresupuestosComponent
  ]
})
export class PresupuestosModule { }
