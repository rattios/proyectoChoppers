import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticasComponent } from './estadisticas.component';

const routes: Routes = [
  {
    path: '',
    component: EstadisticasComponent,
    data: {
      title: 'Estadisticas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstadisticasRoutingModule {}
