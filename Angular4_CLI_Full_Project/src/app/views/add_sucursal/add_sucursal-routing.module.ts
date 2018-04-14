import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Add_sucursalComponent } from './add_sucursal.component';

const routes: Routes = [
  {
    path: '',
    component: Add_sucursalComponent,
    data: {
      title: 'Agregar Sucursal'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Add_sucursalRoutingModule {}
