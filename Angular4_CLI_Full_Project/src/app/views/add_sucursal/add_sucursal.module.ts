import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';
import { UICarouselModule } from "ui-carousel";
import { Add_sucursalComponent } from './add_sucursal.component';
import { Add_sucursalRoutingModule } from './add_sucursal-routing.module';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

@NgModule({
  imports: [
    Add_sucursalRoutingModule,
    CommonModule,
    FormsModule,
    UICarouselModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQeJGiRt1Mat3o7yf6yP2kzzRtu-_FXkw',
      libraries: ["places"]
    })
  ],
  declarations: [ Add_sucursalComponent ]
})
export class Add_sucursalModule { }
