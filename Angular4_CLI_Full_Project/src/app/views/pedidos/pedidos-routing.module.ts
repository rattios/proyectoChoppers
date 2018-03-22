import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { pedidosComponent } from './pedidos.component';
import { misPedidosComponent } from './mis-pedidos.component';
import { todosPedidosComponent } from './todos-pedidos.component';
import { presupuestoComponent } from './presupuesto/presupuesto.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pedidos'
    },
    children: [
      {
        path: 'pedido',
        component: pedidosComponent,
        data: {
          title: 'Pedido'
        }
      },
      {
        path: 'presupuestos/presupuestos',
        component: presupuestoComponent,
        data: {
          title: 'Presupuesto'
        }
      },
      {
        path: 'mis-pedidos',
        component: misPedidosComponent,
        data: {
          title: 'Mis Pedidos'
        },
      },
      {
        path: 'todos-pedidos',
        component: todosPedidosComponent,
        data: {
          title: 'Todos los Pedidos'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class pedidosRoutingModule {}
