import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { verCampanasComponent } from './ver-campanas.component';
import { verCampanasRoutingModule } from './ver-campanas-routing.module';
import { NgDatepickerModule } from 'ng2-datepicker';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { NgxPermissionsModule } from 'ngx-permissions';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    verCampanasRoutingModule,
    ChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    NgDatepickerModule,
    IonRangeSliderModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    NgxPermissionsModule
  ],
  declarations: [ 
  	verCampanasComponent
  ]
})
export class verCampanasModule { }
