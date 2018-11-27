import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { verCuestionariosComponent } from './ver-cuestionarios.component';
import { verCuestionariosRoutingModule } from './ver-cuestionarios-routing.module';
import { TagInputModule } from 'ngx-chips';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    verCuestionariosRoutingModule,
    ChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TagInputModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    NgxPermissionsModule
  ],
  declarations: [ 
  	verCuestionariosComponent
  ]
})
export class verCuestionariosModule { }
