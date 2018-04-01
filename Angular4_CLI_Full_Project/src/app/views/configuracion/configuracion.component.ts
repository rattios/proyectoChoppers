import { Component, OnInit,HostListener, NgZone, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import { MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';


declare var google: any;
@Component({
  templateUrl: 'configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
}
})
export class ConfiguracionComponent {

  @ViewChild("search")
    public searchElementRef: ElementRef;
    private ngZone: NgZone;
  
  constructor(private http: HttpClient, private ruta: RutaService, private mapsAPILoader: MapsAPILoader,private ngZone: NgZone) {
    this.page();
  }

   //http://shopper.internow.com.mx/shoppersAPI/public/empleados
   ngOnInit(): void {
     //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {

          /*Ciudad de México  19.4284706, -99.1276627
          Iztapalapa  19.3573799, -99.0671005
          Ecatepec  19.6172504, -99.0660095
          Guadalajara  20.6668205, -103.3918228
          Puebla de Zaragoza  19.0379295, -98.2034607
          Ciudad Juárez  31.7333298, -106.4833298
          Tijuana  32.5027008, -117.0037079
          Ciudad Neza  19.40061, -99.0148315
          Gustavo A. Madero  19.49016, -99.1097794
          Monterrey  25.6750698, -100.3184662
          León  21.1290798, -101.6737366
          Zapopan  20.7235603, -103.3847885
          Naucalpan de Juárez  19.4785099, -99.2396317
          Chihuahua  28.6352806, -106.0888901
          Alvaro Obregon  19.3586693, -99.2032928
          Guadalupe  25.6767807, -100.2564621
          Mérida  20.9753704, -89.6169586
          Tlanepantla de baz  19.5400505, -99.1953812
          San Luis Potosí  22.1498203, -100.9791565
          Culiacán  24.7903194, -107.3878174
          Aguascalientes  21.8823395, -102.2825928*/

          var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(19.4284706, -99.1276627),
            new google.maps.LatLng(19.3573799, -99.0671005),
            new google.maps.LatLng(19.6172504, -99.0660095),
            new google.maps.LatLng(20.6668205, -103.3918228),
            new google.maps.LatLng(19.0379295, -98.2034607),
            new google.maps.LatLng(31.7333298, -106.4833298),
            new google.maps.LatLng(32.5027008, -117.0037079),
            new google.maps.LatLng(19.40061, -99.0148315),
            new google.maps.LatLng(19.49016, -99.1097794),
            new google.maps.LatLng(25.6750698, -100.3184662),
            new google.maps.LatLng(21.1290798, -101.6737366),
            new google.maps.LatLng(20.7235603, -103.3847885),
            new google.maps.LatLng(19.4785099, -99.2396317),
            new google.maps.LatLng(28.6352806, -106.0888901),
            new google.maps.LatLng(19.3586693, -99.2032928),
            new google.maps.LatLng(25.6767807, -100.2564621),
            new google.maps.LatLng(20.9753704, -89.6169586),
            new google.maps.LatLng(19.5400505, -99.1953812),
            new google.maps.LatLng(22.1498203, -100.9791565),
            new google.maps.LatLng(24.7903194, -107.3878174),
            new google.maps.LatLng(21.8823395, -102.2825928),
          );

          var options = { 
            bounds: defaultBounds,
            //componentRestrictions: {country: "AR"}
            //types: ['(cities)'],
            //componentRestrictions: {country: 'fr'}
          };
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"]
          }, options);
           var circle = new google.maps.Circle({
                  center: {lat:  23.6345005, lng: -102.5527878},
                  radius: 10*1000
                });
                autocomplete.setBounds(circle.getBounds());
            autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              let place = autocomplete.getPlace();
      
              //verify result
              if (place.geometry === undefined || place.geometry === null) {
                return;
              }
              console.log(place.formatted_address);
              /*this.registroClienteForm.patchValue({direccion: place.formatted_address });
              //console.log(place.address_components[0].long_name);
              //set latitude, longitude and zoom
              this.latitude = place.geometry.location.lat();
              this.registroClienteForm.patchValue({lat: place.geometry.location.lat() });
              this.longitude = place.geometry.location.lng();
              this.registroClienteForm.patchValue({lng: place.geometry.location.lng() });*/
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 14;
            });
          });
        });
    }

  public latitude:number = 23.6345005;
  public longitude:number = -102.5527878;
  public zoom:any=8;

  public setDir(dir){
    return Observable.create(observer => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': dir}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                console.log(results[1]);
                //alert(JSON.stringify(results[1].formatted_address));
                //this.setDir(results[1].formatted_address);
                 observer.next(results[1].formatted_address);
                 observer.complete();
                
              } else {
                alert('No results found');
                observer.next({});
                observer.complete();
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              observer.next({});
              observer.complete();
            }
          });
       })
   }


  markerDragEnd($event: MouseEvent) {
    console.log($event);
    var latlng:any;
    
    latlng=$event;
    latlng=latlng.coords;
    console.log(latlng);
    /*this.registroClienteForm.patchValue({lat: latlng.lat });
    this.registroClienteForm.patchValue({lng: latlng.lng });*/

    this.setDir(latlng).subscribe(result => {
     // this.registroClienteForm.patchValue({direccion: result });
      },error => console.log(error),() => console.log('Geocoding completed!')
    );
    
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
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
