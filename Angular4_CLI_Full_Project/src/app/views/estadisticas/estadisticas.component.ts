import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'estadisticas.component.html'
})
export class EstadisticasComponent {

  
  constructor(private http: HttpClient, private ruta: RutaService) { }

   //http://shopper.internow.com.mx/shoppersAPI/public/empleados
   ngOnInit(): void {
    
   }
}
