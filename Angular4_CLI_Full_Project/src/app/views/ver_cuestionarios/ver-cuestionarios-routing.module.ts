import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { verCuestionariosComponent } from './ver-cuestionarios.component';

const routes: Routes = [
  {
    path: '',
    component: verCuestionariosComponent,
    data: {
      title: 'Ver Cuestionarios'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class verCuestionariosRoutingModule {}
