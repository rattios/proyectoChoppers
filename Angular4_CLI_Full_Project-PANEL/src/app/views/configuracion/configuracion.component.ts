import { Component, OnInit, HostListener, NgZone, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { Router } from '@angular/router';
import { MapsAPILoader } from '@agm/core';
import { Observable, Observer } from 'rxjs';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SharedService } from '../../services/sucursales.service';
import { ToastrService } from 'ngx-toastr';

declare var google: any;

@Component({
  templateUrl: 'configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})

export class ConfiguracionComponent {

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInput1') fileInput1: ElementRef;
  @ViewChild('panel') public panel: ElementRef;
  @ViewChild('slider') public slider: ElementRef;
  clear = false;
  fileIMG = null;
  imgUpload = null;
  loadinImg = false;
  fileSucursal = null;  

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
  public data:any;
  public data2:any;
  public images: any = [];
  public registerUserForm: FormGroup;
  public registerSucursalForm: FormGroup;
  public initScroll:boolean = true;
  public endScroll: boolean = true;
  public upload_image: boolean = true;
  public url:string = 'https://api.shopperama.mx/images/flats.png';
  public datosS:any;
  public sucursal = [];
  formErrors = {
    'nombre': '',
    'email': ''
  };
  formErrors1 = {
    'nombre': '',
    'email': '',
    'estado': '',
    'municipio': '',
    'colonia': '',
    'direccion': '',
    'telefono': ''
  };    
  
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private cdRef:ChangeDetectorRef, private sharedService: SharedService) {
    
    if (!this.hasClass(document.querySelector('body'), 'sidebar-hidden')) {
      document.querySelector('body').classList.toggle('sidebar-hidden');
    }
    this.registerUserForm = this.builder.group({
      nombre: [localStorage.getItem('shoppers_nombre'), [Validators.required]],
      email: [localStorage.getItem('shoppers_email'), [Validators.required, Validators.email]],
      telefono: [''],
      imagen: ['https://api.shopperama.mx/images/flats.png']
    });
    this.registerSucursalForm = this.builder.group({
      nombre: [localStorage.getItem('shoppers_nombre'), [Validators.required]],
      email: [localStorage.getItem('shoppers_email'), [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      estado_id: [''], 
      municipio_id: [''], 
      localidad_id: [''],
      direccion: [''],
      Dinicio: ['Lunes'],
      Dfin: ['Domingo'],
      Hinicio: ['6:00'],
      Hfin: ['23:00'],
      imagenes: [''],
      logo: ['https://api.shopperama.mx/images/flats.png'],
      horario: [''],
      lat: [''],
      lng: [''],
      empresa_id: [localStorage.getItem('shoppers_empresa_id')]
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

          var options = {};
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
              this.registerSucursalForm.patchValue({direccion: place.formatted_address });
              this.registerSucursalForm.patchValue({lat: place.geometry.location.lat() });
              this.registerSucursalForm.patchValue({lng: place.geometry.location.lng() });
              this.latitude = place.geometry.location.lat();
              this.longitude = place.geometry.location.lng();
              this.zoom = 18;
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
        this.zoom = 18;
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
        this.estados.sort(function(a, b){
            if(a.nombre < b.nombre) { return -1; }
            if(a.nombre > b.nombre) { return 1; }
            return 0;
        });
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
    if (this.registerSucursalForm.value.estado_id == 9) {
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
        this.municipios.sort(function(a, b){
            if(a.nombre < b.nombre) { return -1; }
            if(a.nombre > b.nombre) { return 1; }
            return 0;
        });
        this.registerSucursalForm.patchValue({municipio_id: this.municipios[0].id});
        this.http.get(this.ruta.get_ruta() + 'mx/get/localidades?municipio_id='+this.municipios[0].id)
        .toPromise()
        .then(
          data => {
            this.datos2 = data;
            this.colonias = this.datos2.localidades;
            this.colonias.sort(function(a, b){
                if(a.nombre < b.nombre) { return -1; }
                if(a.nombre > b.nombre) { return 1; }
                return 0;
            });
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
    this.registerSucursalForm.value.imagenes = JSON.stringify(this.images);
    if (this.registerUserForm.valid) {
      if (this.registerSucursalForm.valid) {
        this.spinnerService.show();
        this.http.post(this.ruta.get_ruta()+'sucursales', this.registerSucursalForm.value)
        .toPromise()
        .then(
        data => {
          this.datosS = data;
          this.sucursal.push(this.datosS.sucursal);
          localStorage.setItem('shoppers_sucursales', JSON.stringify(this.sucursal));
          localStorage.setItem('shopper_idSucursal',this.sucursal[0].id);
          this.http.put(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id'), this.registerUserForm.value)
          .toPromise()
          .then(
          data => {
            this.spinnerService.hide();
            localStorage.setItem('shoppers_menu', 'si');
            document.querySelector('body').classList.toggle('sidebar-hidden');      
            this.router.navigate(['dashboard'], {});
            this.toastr.success('Configuración finalizada con éxito', 'Éxito', {
              timeOut: 5000
            });
          },
          msg => { 
            this.spinnerService.hide();
            this.toastr.error(msg.error.error, 'Error', {
              timeOut: 5000
            });
          });
        },
        msg => { 
          this.spinnerService.hide();
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

  subirImagen(): void {   
    const formModel = this.prepareSave();
    this.http.post(this.ruta.get_ruta()+'imagenes?token='+localStorage.getItem('shoppers_token'), formModel)
    .toPromise()
    .then(
      data => { // Success
          this.data = data;
          this.imgUpload = this.data.imagen;
          this.registerUserForm.patchValue({imagen : this.imgUpload});
          this.registerSucursalForm.patchValue({logo : this.imgUpload});
          localStorage.setItem('shoppers_imagen', this.imgUpload);
          this.sharedService.sucursalData.emit(this.imgUpload);
          //Solo admitimos imágenes.
           if (!this.fileIMG.type.match('image.*')) {
                return;
           }
           this.clear = true;
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
              //this.showToast('error', 'Erro!', msg.error.error);
              console.log('error subiendo la imagen');
          }
       }
     );
    }

  private prepareSave(): any {
    let input = new FormData();
    input.append('imagen', this.fileIMG);
    input.append('carpeta', 'empresas');
    input.append('url_imagen', 'https://api.shopperama.mx/images_uploads/');
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
    this.url = 'assets/img/avatars/flats.png';
    this.registerUserForm.patchValue({imagen : 'https://api.shopperama.mx/images/flats.png'});
    this.registerSucursalForm.patchValue({logo : 'https://api.shopperama.mx/images/flats.png'});
  }

  subirImagenSucursal(): void {  
    this.upload_image = false; 
    const formModel = this.prepareSaveSucursal();
    this.http.post(this.ruta.get_ruta()+'imagenes?token='+localStorage.getItem('shoppers_token'), formModel)
      .toPromise()
      .then(
         data => { // Success
            console.log(data);
            this.data2 = data;
            this.images.push({imagen: this.data2.imagen});
            this.upload_image = true; 
            this.cdRef.detectChanges();
            this.panel.nativeElement.scrollLeft = this.panel.nativeElement.scrollWidth;
            if (this.panel.nativeElement.scrollWidth > this.panel.nativeElement.offsetWidth) {
              this.initScroll = false;
              this.endScroll = true;
            } else {
              this.initScroll = true;
              this.endScroll = true;
            }
            //Solo admitimos imágenes.

            if (!this.fileSucursal.type.match('image.*')) {
                  return;
             }
             console.log('success');
         },
         msg => { // Error
           console.log(msg);
           console.log(msg.error.error);
           this.upload_image = true; 
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

  private prepareSaveSucursal(): any {
    let input = new FormData();
    input.append('imagen', this.fileSucursal);
    input.append('carpeta', 'sucursales');
    input.append('url_imagen', 'https://api.shopperama.mx/images_uploads/');
    return input;
  }

  onFileChangeSucursal(event) {
    if(event.target.files.length > 0) {
      this.fileSucursal = event.target.files[0];
      this.subirImagenSucursal();
    }
  }

  clearImage(image){
    let index = this.images.findIndex((item) => item.imagen === image.imagen);
    if(index !== -1){
      this.images.splice(index, 1);
    }
    this.cdRef.detectChanges();
    if(this.panel.nativeElement.scrollLeft == 0){
      this.initScroll = true;
    }
    if (this.panel.nativeElement.scrollWidth < this.panel.nativeElement.offsetWidth) {
      this.endScroll = true;
    }
  }

  public onPreviousSearchPosition(): void {
    this.panel.nativeElement.scrollLeft -= this.slider.nativeElement.offsetWidth/2;
    this.endScroll = false;
    if(this.panel.nativeElement.scrollLeft == 0){
      this.initScroll = true;
    }
  }

  public onNextSearchPosition(): void {
    var aux_left = this.panel.nativeElement.scrollLeft;
    this.panel.nativeElement.scrollLeft += this.slider.nativeElement.offsetWidth/2;
    this.initScroll = false;
    if (this.panel.nativeElement.scrollLeft == aux_left) {
      this.endScroll = true;
    }
  }

  clearFileSucursal() {
    this.fileInput1.nativeElement.value = ''; 
  }
}
