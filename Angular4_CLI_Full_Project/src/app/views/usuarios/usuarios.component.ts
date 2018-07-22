import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../services/sucursales.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  templateUrl: 'usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  public primaryModal;
  public empleados:any = [];
  public empleado:any;
  public datos:any;
  public sucursales:any = [];
  public sucursal_id: any; 
  public selected:any = [];
  public user:any = {};
  public user_name: string = '';
  public registerUserForm: FormGroup;
  public loading: boolean = false;
  formErrors = {
    'nombre': '',
    'email': '',
    'password': ''
  };

  constructor(private http: HttpClient, private ruta: RutaService, private toastr: ToastrService, private builder: FormBuilder, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) { 
  }

  ngOnInit(): void {
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
      cuest_eidtar: [0],
      cuest_ver: [0],
      cuest_eliminar: [0],
      est_crear: [0],
      est_editar: [0],
      est_ver: [0], 
      est_eliminar: [0],
      sucursales: [''],
      empresa_id: [localStorage.getItem('shoppers_usuario_id')]
    });
    this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
    this.sucursal_id = this.sucursales[0].id;
    this.getUsers();
    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  getUsers(){
    this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/empleados')
    .toPromise()
    .then(
    data => {
      this.empleados=data;
      this.empleados= this.empleados.sucursal.empleados;
      this.loading = true;
      if (this.empleados == '') {
        this.toastr.info('No tienes usuarios asociados a esta sucursal', 'Aviso', {
          timeOut: 5000
        });
      }
    },
    msg => { 
      this.loading = true;
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
      if (this.selected != '') {
        this.registerUserForm.value.sucursales = JSON.stringify(this.selected);
        this.spinnerService.show();
        this.http.post(this.ruta.get_ruta()+'empleados', this.registerUserForm.value)
        .toPromise()
        .then(
        data => {
          this.spinnerService.hide();
          document.getElementById('modal-user').click();
          this.getUsers();
          this.datos = data;
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
        this.toastr.error('¡Debes asignar al menos una sucursal!', 'Error', {
          timeOut: 5000
        }); 
      }
    } else {
      this.validateAllFormFields(this.registerUserForm);
      this.toastr.error('¡Faltan datos del usuario!', 'Error', {
        timeOut: 5000
      });
    }
  }

  showDelete(empleado){
    this.user = empleado;
    this.user_name = empleado.usuario.nombre;
  }

  deleteUser(){
    this.spinnerService.show();
    this.http.delete(this.ruta.get_ruta()+'empleados/'+this.user.id)
    .toPromise()
    .then(
    data => {
      this.spinnerService.hide();
      document.getElementById('modal-delete').click();
      this.getUsers();
      this.user = {}
      this.datos = data;
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
  }

  update_sucursal(event){
    this.sucursal_id = event.target.value;
    this.empleados= [];
    this.getUsers();
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
