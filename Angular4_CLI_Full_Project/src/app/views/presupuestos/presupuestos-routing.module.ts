import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PresupuestosComponent } from './presupuestos.component';

const routes: Routes = [
  {
    path: '',
    component: PresupuestosComponent,
    data: {
      title: 'Presupuestos'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PresupuestosRoutingModule {}
