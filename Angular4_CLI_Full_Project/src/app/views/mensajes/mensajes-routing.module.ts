import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajesComponent } from './mensajes.component';

const routes: Routes = [
  {
    path: '',
    component: MensajesComponent,
    data: {
      title: 'Mensajes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensajesRoutingModule {}
