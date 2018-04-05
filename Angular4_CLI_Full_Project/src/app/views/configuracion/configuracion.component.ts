import { Component, OnInit, HostListener, NgZone, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

declare var google: any;

@Component({
  templateUrl: 'configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})

export class ConfiguracionComponent {

  @ViewChild('fileInput') fileInput: ElementRef;
  clear = false; //puedo borrar?
  fileIMG = null;
  imgUpload = null;
  loadinImg = false;  

  @ViewChild("search")
    public searchElementRef: ElementRef;

    public latitude:number = 23.6345005;
    public longitude:number = -102.5527878;
    public zoom:any=8;
    public datosC: any;
    public categorias: any;
    public datos:any;
    public datos1:any;
    public datos2:any;
    public datos3:any;
    public estados:any;
    public municipios:any;
    public ciudades:any;
    public colonias:any;
    public hora:any;
    public user:any;
    public registerUserForm: FormGroup;
    public registerSucursalForm: FormGroup;
    formErrors = {
      'nombre': '',
      'email': '',
      'telefono': ''
    };
    formErrors1 = {
      'nombre': '',
      'email': '',
      'estado': '',
      'municipio': '',
      'colonia': '',
      'direccion': ''
    };
    public url:string = 'assets/img/avatars/flats.png';
  
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private builder: FormBuilder, private toastr: ToastrService) {
    
    if (!this.hasClass(document.querySelector('body'), 'sidebar-hidden')) {
      document.querySelector('body').classList.toggle('sidebar-hidden');
    }
    this.registerUserForm = this.builder.group({
      nombre: [localStorage.getItem('shoppers_nombre'), [Validators.required]],
      email: [localStorage.getItem('shoppers_email'), [Validators.required, Validators.email]],
      telefono: [''],
      imagen: ['']
    });
    this.registerSucursalForm = this.builder.group({
      nombre: [localStorage.getItem('shoppers_nombre'), [Validators.required]],
      email: [localStorage.getItem('shoppers_email'), [Validators.required, Validators.email]],
      estado: [''],
      ciudad: [''],
      colonia: [''],
      direccion: [''],
      Dinicio: ['Lunes'],
      Dfin: ['Domingo'],
      Hinicio: ['6:00'],
      Hfin: ['23:00'],
      imagenes: [''],
      logo: [''],
      horario: [''],
      lat: [''],
      lng: ['']
    });
    this.user = localStorage.getItem('shoppers_nombre');
    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
    this.registerSucursalForm.valueChanges.subscribe(data => this.onValueChanged1(data));
    this.onValueChanged1();
    this.initializeHora();
    this.page();
  }


  hasClass(target: any, elementClassName: string) {
    return new RegExp('(\\s|^)' + elementClassName + '(\\s|$)').test(target.className);
  }

  onSelectFile(event) {
    console.log(event);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var target:EventTarget;

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
    }
  }

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
              this.registerSucursalForm.patchValue({direccion: place.formatted_address });
              this.registerSucursalForm.patchValue({lat: place.geometry.location.lat() });
              this.registerSucursalForm.patchValue({lng: place.geometry.location.lng() });/*
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

  initializeHora(){
    this.hora = [
      {id: 1, hora: '0:00'},
      {id: 2, hora: '1:00'},
      {id: 3, hora: '2:00'},
      {id: 4, hora: '3:00'},
      {id: 5, hora: '4:00'},
      {id: 6, hora: '5:00'},
      {id: 7, hora: '6:00'},
      {id: 8, hora: '7:00'},
      {id: 9, hora: '8:00'},
      {id: 10, hora: '9:00'},
      {id: 11, hora: '10:00'},
      {id: 12, hora: '11:00'},
      {id: 13, hora: '12:00'},
      {id: 14, hora: '13:00'},
      {id: 15, hora: '14:00'},
      {id: 16, hora: '15:00'},
      {id: 17, hora: '16:00'},
      {id: 18, hora: '17:00'},
      {id: 19, hora: '18:00'},
      {id: 20, hora: '19:00'},
      {id: 21, hora: '20:00'},
      {id: 22, hora: '21:00'},
      {id: 23, hora: '22:00'},
      {id: 24, hora: '23:00'}
    ];
  }

  public setDir(dir){
    return Observable.create(observer => {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'location': dir}, function(results, status) {
            if (status === 'OK') {
              if (results[1]) {
                console.log(results[1]);
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
      this.registerSucursalForm.patchValue({direccion: result });
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
        this.toastr.error('Error', 'No se pudo cargar los estados y ciudades, ingresa de nuevo', {
          timeOut: 5000
        });  
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
                this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
                  timeOut: 5000
                });
            });
          },
          msg => {
            this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
              timeOut: 5000
            });
        });
      },
      msg => {
        this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
          timeOut: 5000
        });
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
                this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
                  timeOut: 5000
                });
            });
          },
          msg => {
            this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
              timeOut: 5000
            });
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
            this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
              timeOut: 5000
            });
        });
      }
    }
  }

  setColonia(event){
    //this.registerUserForm.patchValue({colonia: event});
  }

  updateCompany(){
    console.log(this.registerUserForm.value);
    this.registerSucursalForm.value.horario = JSON.stringify([{dias: this.registerSucursalForm.value.Dinicio + ' a ' + this.registerSucursalForm.value.Dfin, horas: this.registerSucursalForm.value.Hinicio + ' a ' + this.registerSucursalForm.value.Hfin}]);
    console.log(this.registerSucursalForm.value);
    if (this.registerUserForm.valid) {
      if (this.registerSucursalForm.valid) {
        document.querySelector('body').classList.toggle('sidebar-hidden');
        this.router.navigate(['usuarios'], {});
      } else {
        this.validateAllFormFields1(this.registerSucursalForm);
        this.toastr.error('¡Faltan datos de la sucursal!', 'Error', {
          timeOut: 5000
        });
      }
    } else {
      this.validateAllFormFields(this.registerUserForm);
      this.toastr.error('¡Faltan datos de la empresa!', 'Error', {
        timeOut: 5000
      });
    }
  }

  onValueChanged(data?: any) {
    if (!this.registerUserForm) { return; }
    const form = this.registerUserForm;

    for (const field in this.formErrors) { 
      const control = form.get(field);
      this.formErrors[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors[field] += true;
          console.log(key);
        }
      } 
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf:true });
        this.onValueChanged();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  onValueChanged1(data?: any) {
    if (!this.registerSucursalForm) { return; }
    const form = this.registerSucursalForm;

    for (const field in this.formErrors1) { 
      const control = form.get(field);
      this.formErrors1[field] = '';
      if (control && control.dirty && !control.valid) {
        for (const key in control.errors) {
          this.formErrors1[field] += true;
          console.log(key);
        }
      } 
    }
  }

  validateAllFormFields1(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf:true });
        this.onValueChanged1();
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields1(control);
      }
    });
  }


  //Carga de img---<
    public data:any;
    subirImagen(): void {
     
      const formModel = this.prepareSave();

      this.http.post(this.ruta.get_ruta()+'imagenes?token='+localStorage.getItem('shoppers_token'), formModel)
         .toPromise()
         .then(
           data => { // Success
              console.log(data);
              this.data = data;
              this.imgUpload = this.data.imagen;
              this.registerUserForm.patchValue({imagen : this.imgUpload});

              //Solo admitimos imágenes.
               if (!this.fileIMG.type.match('image.*')) {
                    return;
               }

               var reader = new FileReader();

               reader.onload = (function(theFile) {
                   return function(e) {
                   // Creamos la imagen.
                    document.getElementById("list").innerHTML = ['<img class="thumb" src="', e.target.result, '" height="160px"/>'].join('');
                   };
               })(this.fileIMG);
     
               reader.readAsDataURL(this.fileIMG);

               this.clear = true;
 
               alert('success');
           },
           msg => { // Error
             console.log(msg);
             console.log(msg.error.error);

             //token invalido/ausente o token expiro
             if(msg.status == 400 || msg.status == 401){ 
                  //alert(msg.error.error);
                  //ir a login
                  //this.showToast('warning', 'Warning!', msg.error.error);
                  alert('400 0 401');
              }
              else { 
                  //alert(msg.error.error);
                  //this.showToast('error', 'Erro!', msg.error.error);
                  alert('error subiendo la imagen');
              }
           }
         );
    }

    private prepareSave(): any {
      let input = new FormData();
      input.append('imagen', this.fileIMG);
      input.append('carpeta', 'empresas');
      input.append('url_imagen', 'http://shopper.internow.com.mx/images_uploads/');
      return input;
    }

    onFileChange(event) {
      if(event.target.files.length > 0) {
        this.fileIMG = event.target.files[0];

        this.subirImagen();
      }
    }

    clearFile() {
      this.imgUpload = null;
      this.fileInput.nativeElement.value = '';

      this.clear = false;

      this.registerUserForm.patchValue({imagen : null});
    }
    //Carga de img--->
}
