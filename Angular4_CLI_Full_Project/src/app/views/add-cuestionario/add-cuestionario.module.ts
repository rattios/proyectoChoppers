import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';
import { TagInputModule } from 'ngx-chips';
import { AddCuestionarioComponent } from './add-cuestionario.component';
import { AddCuestionarioRoutingModule } from './add-cuestionario-routing.module';
import { IonRangeSliderModule } from "ng2-ion-range-slider";
import { NgDatepickerModule } from 'ng2-datepicker';
import { ArchwizardModule } from 'angular-archwizard';
import { ArraySortPipe } from '../../pipes/sort.pipes';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';


@NgModule({
  imports: [
    AddCuestionarioRoutingModule,
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
  declarations: [ ArraySortPipe, AddCuestionarioComponent ]
})
export class AddCuestionarioModule { }
