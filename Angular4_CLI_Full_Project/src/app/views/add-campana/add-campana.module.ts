import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { TagInputModule } from 'ngx-chips';
import { AddCampanaComponent } from './add-campana.component';
import { AddCampanaRoutingModule } from './add-campana-routing.module';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { NgDatepickerModule } from 'ng2-datepicker';
import { ArchwizardModule } from 'angular-archwizard';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  imports: [
    AddCampanaRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    IonRangeSliderModule,
    NgDatepickerModule,
    ArchwizardModule,
    Ng4LoadingSpinnerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [ AddCampanaComponent ]
})
export class AddCampanaModule { }
