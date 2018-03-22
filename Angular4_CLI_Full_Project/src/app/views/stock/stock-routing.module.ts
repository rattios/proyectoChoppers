import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { stockComponent } from './stock.component';
import { servicioComponent } from './servicio.component';
import { usoComponent } from './uso.component';
import { consumoComponent } from './consumo.component';

const routes: Routes = [
  
      {
        path: 'servicio',
        component: servicioComponent,
        data: {
          title: 'Servicio'
        }
      },
      {
        path: 'uso',
        component: usoComponent,
        data: {
          title: 'Uso'
        },
      },
      {
        path: 'consumo',
        component: consumoComponent,
        data: {
          title: 'Consumo'
        }
      },
      {
        path: 'stock',
        component: stockComponent,
        data: {
          title: 'Stock'
        }
      }
   
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class stockRoutingModule {}
