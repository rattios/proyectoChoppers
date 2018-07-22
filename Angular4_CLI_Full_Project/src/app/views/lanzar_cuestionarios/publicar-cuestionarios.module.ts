import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { publicarCuestionariosComponent } from './publicar-cuestionarios.component';
import { publicarCuestionariosRoutingModule } from './publicar-cuestionarios-routing.module';
import { TagInputModule } from 'ngx-chips';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  imports: [
    publicarCuestionariosRoutingModule,
    ChartsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    TagInputModule,
    ModalModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot(),
    NgxPermissionsModule
  ],
  declarations: [ 
  	publicarCuestionariosComponent
  ]
})
export class publicarCuestionariosModule { }
