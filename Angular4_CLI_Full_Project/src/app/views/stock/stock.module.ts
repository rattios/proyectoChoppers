import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { stockComponent } from './stock.component';
import { stockRoutingModule } from './stock-routing.module';
import { servicioComponent } from './servicio.component';
import { usoComponent } from './uso.component';
import { consumoComponent } from './consumo.component';
import { infoComponent } from './info.component';


@NgModule({
  imports: [
    stockRoutingModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  declarations: [ 
  	stockComponent,
  	servicioComponent,
  	usoComponent,
  	consumoComponent,
    infoComponent
   ]
})
export class stockModule { }
