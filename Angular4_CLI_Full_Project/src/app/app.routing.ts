import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayout,
  SimpleLayout
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayout,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
        
      },
      {
        path: 'components',
        loadChildren: './views/components/components.module#ComponentsModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'usuarios',
        loadChildren: './views/usuarios/usuarios.module#UsuariosModule'
      },
      {
        path: 'configuracion',
        loadChildren: './views/configuracion/configuracion.module#ConfiguracionModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'login',
        loadChildren: './views/pages/pages.module#PagesModule'
      },
      {
        path: 'proveedores',
        loadChildren: './views/proveedores/proveedores.module#ProveedoresModule'
      },
      {
        path: 'pedidos',
        loadChildren: './views/pedidos/pedidos.module#pedidosModule'
      },
      {
        path: 'stock',
        loadChildren: './views/stock/stock.module#stockModule'
      },
      {
        path: 'categorias',
        loadChildren: './views/categorias/categorias.module#CategoriasModule'
      },
      {
        path: 'mensajes',
        loadChildren: './views/mensajes/mensajes.module#MensajesModule'
      }
    ]
  },
  {
    path: 'pages',
    component: SimpleLayout,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
