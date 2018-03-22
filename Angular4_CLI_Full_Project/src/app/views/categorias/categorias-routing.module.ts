import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriasComponent } from './categorias.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriasComponent,
    data: {
      title: 'Categorias'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriasRoutingModule {}
