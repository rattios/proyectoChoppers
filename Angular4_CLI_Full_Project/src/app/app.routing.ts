import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

// Import Containers
import {
  FullLayout,
  SimpleLayout
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayout,
    data: {
      title: ''
    },
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        data: {
          permissions: {
            only: ['EMPRESA','EMPLEADO'],
            redirectTo: 'login'
          }
        }    
      },{
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'components',
        loadChildren: './views/components/components.module#ComponentsModule',
        data: {
          permissions: {
            only: ['EMPRESA','EMPLEADO'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule',
        data: {
          permissions: {
            only: ['EMPRESA','EMPLEADO'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule',
        data: {
          permissions: {
            only: ['EMPRESA','EMPLEADO'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'usuarios',
        loadChildren: './views/usuarios/usuarios.module#UsuariosModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'configuracion',
        loadChildren: './views/configuracion/configuracion.module#ConfiguracionModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'add_campana',
        loadChildren: './views/add-campana/add-campana.module#AddCampanaModule',
        data: {
          permissions: {
            only: ['EMPRESA','CAMP_CREAR'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'ver_campanas',
        loadChildren: './views/ver_campanas/ver-campanas.module#verCampanasModule',
        data: {
          permissions: {
            only: ['EMPRESA','CAMP_VER','CAMP_EDIT','CAMP_DELETE'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'add_cuestionario',
        loadChildren: './views/add-cuestionario/add-cuestionario.module#AddCuestionarioModule',
        data: {
          permissions: {
            only: ['EMPRESA','CUEST_CREAR'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'ver_cuestionarios',
        loadChildren: './views/ver_cuestionarios/ver-cuestionarios.module#verCuestionariosModule',
        data: {
          permissions: {
            only: ['EMPRESA','CUEST_VER','CUEST_EDIT','CUEST_DELETE'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'presupuesto_cuestionario',
        loadChildren: './views/presupuesto-cuestionario/presupuesto-cuestionario.module#presupuestoCuestionarioModule',
        data: {
          permissions: {
            only: ['EMPRESA','CAMP_CREAR'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'publicar_cuestionario',
        loadChildren: './views/lanzar_cuestionarios/publicar-cuestionarios.module#publicarCuestionariosModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'estadisticas',
        loadChildren: './views/estadisticas/estadisticas.module#EstadisticasModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'presupuestos',
        loadChildren: './views/presupuestos/presupuestos.module#PresupuestosModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'add_sucursal',
        loadChildren: './views/add_sucursal/add_sucursal.module#Add_sucursalModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'ver_sucursal',
        loadChildren: './views/ver_sucursal/ver_sucursal.module#Ver_sucursalModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'categorias',
        loadChildren: './views/categorias/categorias.module#CategoriasModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
      },
      {
        path: 'mi_cuenta',
        loadChildren: './views/perfil/perfil.module#PerfilModule',
        data: {
          permissions: {
            only: ['EMPRESA'],
            redirectTo: 'login'
          }
        }
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
  },
  {
    path: 'login',
    component: SimpleLayout,
    data: {
      title: 'Login',
    },      
    children: [
      {
        path: '',
        loadChildren: './views/login/login.module#LoginModule'
      }
    ]
  },
  {
    path: 'inicio',
    component: SimpleLayout,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/principal/principal.module#PrincipalModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
