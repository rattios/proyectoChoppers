import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

import { CampanasComponent } from './campanas.component';
import { CampanasRoutingModule } from './campanas-routing.module';

@NgModule({
  imports: [
    CampanasRoutingModule,
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [ CampanasComponent ]
})
export class CampanasModule { }
