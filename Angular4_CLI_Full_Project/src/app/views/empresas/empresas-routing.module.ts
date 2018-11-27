import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresasComponent } from './empresas.component';

const routes: Routes = [
  {
    path: '',
    component: EmpresasComponent,
    data: {
      title: 'Empresas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule {}
