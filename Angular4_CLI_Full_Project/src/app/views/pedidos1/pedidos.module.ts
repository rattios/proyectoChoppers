import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';

import { pedidosComponent } from './pedidos.component';
import { misPedidosComponent } from './mis-pedidos.component';
import { todosPedidosComponent } from './todos-pedidos.component';
import { infoComponent } from './info.component';
import { tablaInfoComponent } from './tablaInfo.component';
import { pedidosRoutingModule } from './pedidos-routing.module';

@NgModule({
  imports: [
    pedidosRoutingModule,
    ChartsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    TabsModule,
    AlertModule.forRoot()
  ],
  declarations: [ 
  	pedidosComponent,
  	misPedidosComponent,
  	todosPedidosComponent,
    infoComponent,
    tablaInfoComponent
	]
})
export class pedidosModule { }
