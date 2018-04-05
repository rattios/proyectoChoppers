import { Injectable } from '@angular/core';

@Injectable()
export class RutaService {

  public ruta_servidor=" http://shopper.internow.com.mx/shoppersAPI/public/";

  constructor() { }

  get_ruta(){
  	return this.ruta_servidor;
  }

}
