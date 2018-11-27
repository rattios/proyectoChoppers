import { Injectable } from '@angular/core';

@Injectable()
export class RutaService {

  public ruta_servidor = "https://api.shopperama.mx/";

  public ruta_open = "https://sandbox-api.openpay.mx/v1/mlfpboaflbbaboev97wm/";

  constructor() { }

  get_ruta(){
  	return this.ruta_servidor;
  }

  get_open(){
  	return this.ruta_open;
  }

}
