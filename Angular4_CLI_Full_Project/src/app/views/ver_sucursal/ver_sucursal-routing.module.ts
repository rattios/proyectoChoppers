import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Ver_sucursalComponent } from './ver_sucursal.component';

const routes: Routes = [
  {
    path: '',
    component: Ver_sucursalComponent,
    data: {
      title: 'Ver Sucursales'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Ver_sucursalRoutingModule {}
