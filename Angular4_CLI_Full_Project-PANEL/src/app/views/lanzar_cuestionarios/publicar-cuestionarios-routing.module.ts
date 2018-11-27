import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { publicarCuestionariosComponent } from './publicar-cuestionarios.component';

const routes: Routes = [
  {
    path: '',
    component: publicarCuestionariosComponent,
    data: {
      title: 'Publicar Cuestionarios'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class publicarCuestionariosRoutingModule {}
