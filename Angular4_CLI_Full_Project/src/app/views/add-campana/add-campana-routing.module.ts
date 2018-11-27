import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCampanaComponent } from './add-campana.component';

const routes: Routes = [
  {
    path: '',
    component: AddCampanaComponent,
    data: {
      title: 'Agregar Campaña'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddCampanaRoutingModule {}
