import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { presupuestoCuestionarioComponent } from './presupuesto-cuestionario.component';

const routes: Routes = [
  {
    path: '',
    component: presupuestoCuestionarioComponent,
    data: {
      title: 'Asignar Presupuesto'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class presupuestoCuestionarioRoutingModule {}
