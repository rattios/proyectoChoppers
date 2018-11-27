import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuestionariosComponent } from './cuestionarios.component';

const routes: Routes = [
  {
    path: '',
    component: CuestionariosComponent,
    data: {
      title: 'Cuestionarios'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuestionariosRoutingModule {}
