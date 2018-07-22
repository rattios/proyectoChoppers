import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCuestionarioComponent } from './add-cuestionario.component';

const routes: Routes = [
  {
    path: '',
    component: AddCuestionarioComponent,
    data: {
      title: 'Agregar Cuestionario'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCuestionarioRoutingModule {}
