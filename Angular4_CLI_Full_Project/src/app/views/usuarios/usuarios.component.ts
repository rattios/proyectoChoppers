import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  templateUrl: 'usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  public primaryModal;
  public empleados:any;
  public empleado:any;
  public datos:any;
  public sucursales:any;
  public selected:any = [];
  public usuario:any={
    camp_crear:0,
    camp_editar:0,
    camp_ver:0,
    camp_eliminar:0,
    cuest_crear:0,
    cuest_editar:0,
    cuest_ver:0,
    cuest_eliminar:0,
    est_crear:0,
    est_editar:0,
    est_ver:0, 
    est_eliminar:0,
    email:'',
    password:'',
    nombre:'',
    empresa_id: localStorage.getItem('shoppers_usuario_id')
  };
  public registerUserForm: FormGroup;
  formErrors = {
    'nombre': '',
    'email': '',
    'password': ''
  };

  constructor(private http: HttpClient, private ruta: RutaService, private toastr: ToastrService, private builder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService) { 
  }

  ngOnInit(): void {
    this.http.get(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id') +'/empleados')
    .toPromise()
    .then(
    data => {
      this.empleados=data;
      this.empleados= this.empleados.empresa.empleados;
      if (this.empleados == '') {
        this.toastr.info('Aun no tienes usuarios asociados a la empresa', 'Aviso', {
          timeOut: 5000
        });
      }
      this.http.get(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id') +'/sucursales')
      .toPromise()
      .then(
      data => {
        this.sucursales=data;
        this.sucursales= this.sucursales.empresa.sucursales;
      },
      msg => { 
      });
    },
    msg => { 
      this.toastr.warning(msg.error.error, 'Aviso', {
        timeOut: 5000
      });
    });
    this.registerUserForm = this.builder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      imagen: [''],
      camp_crear: [0],
      camp_editar: [0],
      camp_ver: [0],
      camp_eliminar: [0],
      cuest_crear: [0],
      cuest_editar: [0],
      cuest_ver: [0],
      cuest_eliminar: [0],
      est_crear: [0],
      est_editar: [0],
      est_ver: [0], 
      est_eliminar: [0],
      sucursales: [''],
      empresa_id: [localStorage.getItem('shoppers_usuario_id')]
    });
    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  getUsers(){
    this.http.get(this.ruta.get_ruta()+'empresas/'+ localStorage.getItem('shoppers_usuario_id') +'/empleados')
    .toPromise()
    .then(
    data => {
      this.empleados=data;
      this.empleados= this.empleados.empresa.empleados;
      if (this.empleados == '') {
        this.toastr.info('Aun no tienes usuarios asociados a la empresa', 'Aviso', {
          timeOut: 5000
        });
      }
    },
    msg => { 
      this.toastr.warning(msg.error.error, 'Aviso', {
        timeOut: 5000
      });
    });
  }

  changePermiso(e,permisos){
   this.spinnerService.show();
   this.http.put(this.ruta.get_ruta()+'permisos/'+permisos.id,permisos)
   .toPromise()
   .then(
   data => {
     this.spinnerService.hide();
      this.toastr.success('Permisos de usuario actualizado con éxito', 'Éxito', {
        timeOut: 5000
      });
    },
   msg => { 
     this.spinnerService.hide();
     console.log(msg);
   });
  }

  changeSucursal(e,item){
    item.check=!item.check;
    if(item.check){
      this.selected.push(item);
    } else {
      let index = this.selected.findIndex((item1) => item1.id === item.id);
      if(index !== -1){
        this.selected.splice(index, 1);
      }
    }
  }

  createUser(){
    if (this.registerUserForm.valid) {
      this.spinnerService.show();
      this.http.post(this.ruta.get_ruta()+'empleados', this.registerUserForm.value)
      .toPromise()
      .then(
      data => {
        this.spinnerService.hide();
        document.getElementById('modal-user').click();
        this.getUsers();
        this.toastr.success(this.datos.message, 'Éxito', {
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
      this.validateAllFormFields(this.registerUserForm);
      this.toastr.error('¡Faltan datos del usuario!', 'Error', {
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
}
