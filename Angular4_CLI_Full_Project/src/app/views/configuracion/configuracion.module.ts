import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AgmCoreModule } from '@agm/core';

import { ConfiguracionComponent } from './configuracion.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
//AIzaSyAQeJGiRt1Mat3o7yf6yP2kzzRtu-_FXkw
@NgModule({
  imports: [
    ConfiguracionRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQeJGiRt1Mat3o7yf6yP2kzzRtu-_FXkw',
      libraries: ["places"]
    })
  ],
  declarations: [ ConfiguracionComponent ]
})
export class ConfiguracionModule { }
