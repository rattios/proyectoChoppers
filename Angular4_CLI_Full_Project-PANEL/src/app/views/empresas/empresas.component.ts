import { Component, ViewChild, ElementRef } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ModalDirective } from 'ngx-bootstrap/modal';

import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: 'empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent {

  @ViewChild('editCategoriaModal') public lgModal: ModalDirective;
  @ViewChild('fileInput') fileInput: ElementRef;
  public datos: any;
  public empresas: any;
  public registerCategoriaForm: FormGroup;
  public url:string = '';
  formErrors1 = {
    'nombre': ''
  };
  public data: any;
  public clear = false;
  public fileIMG = null;
  public imgUpload = null;
  categoriaDelete = {
    nombre: '',
    id: '',
    categoria_id: ''
  };

  constructor(private http: HttpClient, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.initEditForm();
  }

  ngOnInit(): void {
    this.initCompany();  
  }

  initCompany(){
    this.http.get(this.ruta.get_ruta()+'empresas')
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.empresas = this.datos.empresas;
    },
    msg => { 
      this.empresas = [];
    });
  }

  initEditForm(){
    this.registerCategoriaForm = this.builder.group({
      nombre: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      categoria_id: ['']
    });
    this.registerCategoriaForm.valueChanges.subscribe(data => this.onValueChanged1(data));
    this.onValueChanged1();
  }

  showAddCat(){
    this.registerCategoriaForm.patchValue({nombre: '' });
    this.registerCategoriaForm.patchValue({categoria_id: '' });
    this.registerCategoriaForm.patchValue({imagen: '' });
    this.url = 'assets/img/category.png';
  }

  editCategoria(categoria){
    this.registerCategoriaForm.patchValue({nombre: categoria.nombre });
    this.registerCategoriaForm.patchValue({categoria_id: categoria.categoria_id });
    this.registerCategoriaForm.patchValue({imagen: categoria.imagen });
    this.url = categoria.imagen;
    this.lgModal.show();
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

  onValueChanged1(data?: any) {
    if (!this.registerCategoriaForm) { return; }
    const form = this.registerCategoriaForm;

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
        console.log(data);
        this.data = data;
        this.imgUpload = this.data.imagen;
        this.registerCategoriaForm.patchValue({imagen: this.imgUpload});

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
    input.append('carpeta', 'categorias');
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
    this.url = localStorage.getItem('shoppers_imagen');
    this.registerCategoriaForm.patchValue({imagen: localStorage.getItem('shoppers_imagen')});
  }

  addCategory(){
    if (this.registerCategoriaForm.valid) {
      this.spinnerService.show();
      this.http.post(this.ruta.get_ruta()+'categorias', this.registerCategoriaForm.value)
      .toPromise()
      .then(
      data => {
        this.spinnerService.hide();
        this.initCompany();
        document.getElementById('modal-sucursal1').click();
        this.toastr.success('Preferencia agregada con éxito', 'Éxito', {
          timeOut: 5000
        });
      },
      msg => { 
        this.spinnerService.hide();
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 5000
        });
      });
    } else {
      this.validateAllFormFields1(this.registerCategoriaForm);
      this.toastr.error('¡Complete el nombre e imagen de la preferencia!', 'Error', {
        timeOut: 5000
      });
    };
  };

  updateCompany(){
    if (this.registerCategoriaForm.valid) {
      this.spinnerService.show();
      this.http.put(this.ruta.get_ruta()+'categorias/'+this.registerCategoriaForm.value.categoria_id, this.registerCategoriaForm.value)
      .toPromise()
      .then(
      data => {
        this.spinnerService.hide();
        this.initCompany();
        document.getElementById('modal-sucursal').click();
        this.toastr.success('Preferencia editada con éxito', 'Éxito', {
          timeOut: 5000
        });
      },
      msg => { 
        this.spinnerService.hide();
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 5000
        });
      });
    } else {
      this.validateAllFormFields1(this.registerCategoriaForm);
      this.toastr.error('¡Complete el nombre e imagen de la preferencia!', 'Error', {
        timeOut: 5000
      });
    };
  };

  deleteCategoria(categoria){
    this.spinnerService.show();
    this.http.delete(this.ruta.get_ruta()+'categorias/'+categoria.categoria_id)
    .toPromise()
    .then(
    data => {
      this.spinnerService.hide();
      this.initCompany();
      this.toastr.success('Categoria eliminada con éxito', 'Éxito', {
        timeOut: 5000
      });
    },
    msg => { 
      this.spinnerService.hide();
      this.toastr.error(msg.error.error, 'Error', {
        timeOut: 5000
      });
    });
  }
}
