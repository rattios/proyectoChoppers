import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';

import { pedidosComponent } from './pedidos.component';
import { misPedidosComponent } from './mis-pedidos.component';
import { todosPedidosComponent } from './todos-pedidos.component';
import { infoComponent } from './info.component';
import { misInfoComponent } from './misInfo.component';
import { tablaInfoComponent } from './tablaInfo.component';
import { misTablaInfoComponent } from './misTablaInfo.component';
import { pedidosRoutingModule } from './pedidos-routing.module';
import { transferenciaComponent } from './transferencia.component';
import { transInfoComponent } from './transInfo.component';
import { presupuestoComponent } from './presupuesto/presupuesto.component';

@NgModule({
  imports: [
    pedidosRoutingModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    TabsModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [ 
  	pedidosComponent,
  	misPedidosComponent,
  	todosPedidosComponent,
    infoComponent,
    tablaInfoComponent,
    misTablaInfoComponent,
    misInfoComponent,
    transferenciaComponent,
    transInfoComponent,
    presupuestoComponent
	]
})
export class pedidosModule { }
