import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { verCampanasComponent } from './ver-campanas.component';

const routes: Routes = [
  {
    path: '',
    component: verCampanasComponent,
    data: {
      title: 'Ver Campañas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class verCampanasRoutingModule {}
