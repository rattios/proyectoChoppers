import { Injectable } from '@angular/core';

@Injectable()
export class RutaService {

  public ruta_servidor = "https://api.shopperama.mx/";

  constructor() { }

  get_ruta(){
  	return this.ruta_servidor;
  }

}
