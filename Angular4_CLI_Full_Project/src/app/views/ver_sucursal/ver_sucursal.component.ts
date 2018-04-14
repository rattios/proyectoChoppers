import { Component, OnInit, HostListener, NgZone, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

declare var google: any;

@Component({
  templateUrl: 'ver_sucursal.component.html',
  styleUrls: ['./ver_sucursal.component.css']
})

export class Ver_sucursalComponent {

  //@ViewChild('fileInput') fileInput: ElementRef;
  clear = false;
  fileIMG = null;
  imgUpload = null;
  loadinImg = false;  

  @ViewChild("search")
  public searchElementRef: ElementRef;
  public latitude:number = 23.6345005;
  public longitude:number = -102.5527878;
  public city: string = 'Municipio';
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
  public registerSucursalForm: FormGroup;
  public url:string = localStorage.getItem('shoppers_imagen');
  formErrors1 = {
    'nombre': '',
    'email': '',
    'estado': '',
    'municipio': '',
    'colonia': '',
    'direccion': ''
  };

  public sucursales:any;
  
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.initSucursales();
  }

  initSucursales(){
    //this.spinnerService.show();
    this.http.get(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id') +'/sucursales')
    .toPromise()
    .then(
      data => {
        console.log(data);
        this.sucursales=data;
        this.sucursales= this.sucursales.empresa.sucursales;
        //this.spinnerService.hide();
      },
      msg => {
        this.toastr.error('Error', 'No se pudo cargar los estados, ingresa de nuevo', {
          timeOut: 5000
        });  
    });
  }

  hasClass(target: any, elementClassName: string) {
    return new RegExp('(\\s|^)' + elementClassName + '(\\s|$)').test(target.className);
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      var target:EventTarget;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event:any) => {
        this.url = event.target.result;
      }
    }
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
    var latlng:any;
    latlng=$event;
    latlng=latlng.coords;
    console.log(latlng);
    this.registerSucursalForm.patchValue({lat: latlng.lat });
    this.registerSucursalForm.patchValue({lng: latlng.lng });

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
    this.http.get(this.ruta.get_ruta() + 'mx/get/estados')
    .toPromise()
    .then(
      data => {
        this.datos = data;
        this.estados = this.datos.estados;
        this.registerSucursalForm.patchValue({estado_id: this.estados[0].id}); 
        this.setEstado(this.estados[0].id);
      },
      msg => {
        this.toastr.error('Error', 'No se pudo cargar los estados, ingresa de nuevo', {
          timeOut: 5000
        });  
    });
  }

  setEstado(estado){
    this.municipios = [];
    this.colonias = [];
    this.initEstados(this.registerSucursalForm.value.estado_id);
    if (estado == 9) {
      this.city = 'Delegación';
    } else {
      this.city = 'Municipio';
    }
  }

  initEstados(estado_id){
    this.http.get(this.ruta.get_ruta() + 'mx/get/municipios?estado_id='+estado_id)
    .toPromise()
    .then(
      data => {
        this.datos1 = data;
        this.municipios = this.datos1.municipios;
        this.registerSucursalForm.patchValue({municipio_id: this.municipios[0].id});
        this.http.get(this.ruta.get_ruta() + 'mx/get/localidades?municipio_id='+this.municipios[0].id)
        .toPromise()
        .then(
          data => {
            this.datos2 = data;
            this.colonias = this.datos2.localidades;
            this.registerSucursalForm.patchValue({localidad_id: this.colonias[0].id});
          },
          msg => {
            this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
              timeOut: 5000
            });
        });
      },
      msg => {
        this.toastr.error('Error', 'No se pudo cargar los municipios, intenta de nuevo', {
          timeOut: 5000
        });
    });
  }

  setMunicipio(event){
    this.colonias = [];
    this.http.get(this.ruta.get_ruta() + 'mx/get/localidades?municipio_id='+ this.registerSucursalForm.value.municipio_id)
    .toPromise()
    .then(
      data => {
        this.datos2 = data;
        this.colonias = this.datos2.localidades;
        this.registerSucursalForm.patchValue({localidad_id: this.colonias[0].id});
      },
      msg => {
        this.toastr.error('Error', 'No se pudo cargar las colonias, intenta de nuevo', {
          timeOut: 5000
        });
    });
  }

  updateCompany(){
    this.registerSucursalForm.value.horario = JSON.stringify([{dias: this.registerSucursalForm.value.Dinicio + ' a ' + this.registerSucursalForm.value.Dfin, horas: this.registerSucursalForm.value.Hinicio + ' a ' + this.registerSucursalForm.value.Hfin}]);
    if (this.registerSucursalForm.valid) {
      this.http.post(this.ruta.get_ruta()+'sucursales', this.registerSucursalForm.value)
      .toPromise()
      .then(
      data => {
        this.toastr.success('Sucursal agregada con éxito', 'Éxito', {
          timeOut: 5000
        });
      },
      msg => { 
        console.log(msg);
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 5000
        });
      });
    } else {
      this.validateAllFormFields1(this.registerSucursalForm);
      this.toastr.error('¡Faltan datos de la sucursal!', 'Error', {
        timeOut: 5000
      });
    }
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
            this.registerSucursalForm.patchValue({logo : this.imgUpload});

            //Solo admitimos imágenes.
             if (!this.fileIMG.type.match('image.*')) {
                  return;
             }

             this.clear = true;

             console.log('success');
         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);

           //token invalido/ausente o token expiro
           if(msg.status == 400 || msg.status == 401){ 
                //alert(msg.error.error);
                //ir a login
                //this.showToast('warning', 'Warning!', msg.error.error);
                console.log('400 0 401');
            }
            else { 
                //alert(msg.error.error);
                //this.showToast('error', 'Error!', msg.error.error);
                console.log('error subiendo la imagen');
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
    //this.fileInput.nativeElement.value = '';
    this.clear = false;
    this.url = localStorage.getItem('shoppers_imagen');
    this.registerSucursalForm.patchValue({logo : localStorage.getItem('shoppers_imagen')});
  }
}
