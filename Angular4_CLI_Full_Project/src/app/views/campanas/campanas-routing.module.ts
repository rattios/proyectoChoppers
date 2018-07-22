import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampanasComponent } from './campanas.component';

const routes: Routes = [
  {
    path: '',
    component: CampanasComponent,
    data: {
      title: 'Campañas'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampanasRoutingModule {}
