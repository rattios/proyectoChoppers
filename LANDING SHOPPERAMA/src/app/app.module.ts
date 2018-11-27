import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RutaService } from './services/ruta.service';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';

// Import containers
import {
  FullLayout
} from './containers';

const APP_CONTAINERS = [
  FullLayout
]

// Import routing module
import { AppRoutingModule } from './app.routing';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    Ng4LoadingSpinnerModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS
  ],
  providers: [
    RutaService,
  {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
