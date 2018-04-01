import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';

@Component({
  templateUrl: 'configuracion.component.html'
})
export class ConfiguracionComponent {

  
  constructor(private http: HttpClient, private ruta: RutaService) {
    this.page();
  }

   //http://shopper.internow.com.mx/shoppersAPI/public/empleados
   ngOnInit(): void {
     
   }

   public datos:any;
   public datos1:any;
   public datos2:any;
   public datos3:any;
   public estados:any;
   public municipios:any;
   public ciudades:any;
   public colonias:any;
   page(){
    this.http.get(this.ruta.get_ruta() + 'sepomex/get/estados')
    .toPromise()
    .then(
      data => {
        this.datos = data;
        this.estados = this.datos.estados;
        console.log(this.estados);
        //this.registerUserForm.patchValue({estado: this.estados[0].estado}); 
        this.setEstado(this.estados[0].estado);
        
      },
      msg => {
        alert('No se pudo cargar los estados y ciudades, ingresa de nuevo');
        
    });
  }

  setEstado(estado){
    var estado_id = 0;
    this.municipios = [];
    this.ciudades = [];
    this.colonias = [];
    for (var i = 0; i < this.estados.length; ++i) {
      if (estado == this.estados[i].estado) {
        estado_id = this.estados[i].id;
        this.initEstados(estado_id);
      }
    }
  }

  initEstados(estado_id){
    this.http.get(this.ruta.get_ruta() + 'sepomex/get/municipios?estado_id='+estado_id)
    .toPromise()
    .then(
      data => {
        this.datos1 = data;
        this.municipios = this.datos1.municipios;
        //this.registerUserForm.patchValue({municipio: this.municipios[0].municipio});
        this.http.get(this.ruta.get_ruta() + 'sepomex/get/ciudades?municipio_id='+this.municipios[0].id)
        .toPromise()
        .then(
          data => {
            this.datos2 = data;
            this.ciudades = this.datos2.ciudades;
            //this.registerUserForm.patchValue({ciudad: this.ciudades[0].ciudad});
            this.http.get(this.ruta.get_ruta() + 'sepomex/get/asentamientos?ciudad_id='+this.ciudades[0].id)
            .toPromise()
            .then(
              data => {
                this.datos3 = data;
                this.colonias = this.datos3.asentamientos;
                //this.registerUserForm.patchValue({colonia: this.colonias[0].asentamiento});
              },
              msg => {
                alert('No se pudo cargar los estados y ciudades, intenta de nuevo');
            });
          },
          msg => {
            alert('No se pudo cargar los estados y ciudades, intenta de nuevo');
        });
      },
      msg => {
        alert('No se pudo cargar los estados y ciudades, intenta de nuevo');
    });
  }

  setMunicipio(event){
    this.ciudades = [];
    this.colonias = [];
    for (var i = 0; i < this.municipios.length; ++i) {
      if (event == this.municipios[i].municipio) {
        this.http.get(this.ruta.get_ruta() + 'sepomex/get/ciudades?municipio_id='+this.municipios[i].id)
        .toPromise()
        .then(
          data => {
            this.datos2 = data;
            this.ciudades = this.datos2.ciudades;
            //this.registerUserForm.patchValue({ciudad: this.ciudades[0].ciudad});
            this.http.get(this.ruta.get_ruta() + 'sepomex/get/asentamientos?ciudad_id='+this.ciudades[0].id)
            .toPromise()
            .then(
              data => {
                this.datos3 = data;
                this.colonias = this.datos3.asentamientos;
               // this.registerUserForm.patchValue({colonia: this.colonias[0].asentamiento});
              },
              msg => {
                alert('No se pudo cargar los estados y ciudades, intenta de nuevo');
            });
          },
          msg => {
            alert('No se pudo cargar los estados y ciudades, intenta de nuevo');
        });
      }
    }
  }

  setCiudad(event){
    this.colonias = [];
    for (var i = 0; i < this.ciudades.length; ++i) {
      if (event == this.ciudades[i].ciudad) {
        this.http.get(this.ruta.get_ruta() + 'sepomex/get/asentamientos?ciudad_id='+this.ciudades[i].id)
        .toPromise()
        .then(
          data => {
            this.datos3 = data;
            this.colonias = this.datos3.asentamientos;
            //this.registerUserForm.patchValue({colonia: this.colonias[0].asentamiento});
          },
          msg => {
            alert('No se pudo cargar los estados y ciudades, intenta de nuevo');
        });
      }
    }
  }

  setColonia(event){
    //this.registerUserForm.patchValue({colonia: event});
  }
}
