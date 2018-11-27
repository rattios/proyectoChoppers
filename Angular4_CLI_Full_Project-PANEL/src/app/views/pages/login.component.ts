import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  public usuario:any;
  public empresa:any;
  public result:any;
  public datos: any;
  public isRegistrar=false;
  public registerUserForm: FormGroup;
  formErrors = {
    'nombre': '',
    'email': '',
    'password': ''
  };
  
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.usuario = {
    	email:'',
    	password:''
    }
    this.initCategory();
  }
  
  initCategory() {
    this.registerUserForm = this.builder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.registerUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  verRegistrar(){
    if( this.isRegistrar!=true) {
      this.isRegistrar=true;
    }else{
      this.isRegistrar=false;
    }
  }

  registrar(){
    this.registerUserForm.value.email = this.registerUserForm.value.email.toLowerCase();
    if (this.registerUserForm.valid) {
      this.spinnerService.show();
      this.http.post(this.ruta.get_ruta()+'empresas', this.registerUserForm.value)
      .toPromise()
      .then(
        data => { // Success
          this.http.post(this.ruta.get_ruta()+'login/web', this.registerUserForm.value)
            .toPromise()
            .then(
              data => { // Success
                this.result=data;
                localStorage.setItem('shoppers_token', this.result.token);
                localStorage.setItem('shoppers_nombre', this.result.user.nombre);
                localStorage.setItem('shoppers_usuario_id', this.result.user.empresa.id);
                localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
                localStorage.setItem('shoppers_email', this.result.user.email);
                localStorage.setItem('shoppers_menu', 'no');
                this.spinnerService.hide();
                this.toastr.success('Tu empresa ha sido registrada con éxito', '¡Bienvenido a Shopper!', {
                  timeOut: 5000
                });
                this.router.navigate(['configuracion'], {});
             },
              msg => { // Error
                this.spinnerService.hide();
                this.toastr.error(msg.error.error, 'Error', {
                  timeOut: 5000
                });
              }
            );
       },
        msg => { // Error
          this.spinnerService.hide();
          this.toastr.error(msg.error.error, 'Error', {
            timeOut: 5000
          });
        }
      );
    } else {
      this.validateAllFormFields(this.registerUserForm);
      this.toastr.error('¡Faltan datos para el registro!', 'Error', {
        timeOut: 5000
      });
    }
  }

  login(){
    this.spinnerService.show();
  	this.http.post(this.ruta.get_ruta()+'login/web', this.usuario)
    .toPromise()
    .then(
      data => { // Success
        console.log(data);
        this.result=data;
        localStorage.setItem('shoppers_token', this.result.token);
        localStorage.setItem('shoppers_nombre', this.result.user.nombre);      
        localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
        localStorage.setItem('shoppers_email', this.result.user.email);
        if(this.result.user.tipo_usuario == 2){
          localStorage.setItem('shoppers_usuario_id', this.result.user.empresa.id);
          localStorage.setItem('shoppers_imagen', this.result.user.empresa.imagen);
          if (this.result.user.empresa.sucursales == '') {
            localStorage.setItem('shoppers_menu', 'no');
            localStorage.setItem('sucursales', JSON.stringify(['']));
            this.spinnerService.hide();
            this.router.navigate(['configuracion'], {});
          } else {
            localStorage.setItem('shoppers_menu', 'si');
            localStorage.setItem('sucursales', JSON.stringify(this.result.user.empresa.sucursales));
            this.spinnerService.hide();
            this.router.navigate(['dashboard'], {});
          } 
        }  
        if(this.result.user.tipo_usuario == 3){
          localStorage.setItem('shoppers_usuario_id', this.result.user.empleado.id);
          localStorage.setItem('sucursales', JSON.stringify(this.result.user.empleado.sucursales));
          console.log(this.result.user.empleado.permisos);
          localStorage.setItem('shopper_permisos', JSON.stringify(this.result.user.empleado.permisos));
          localStorage.setItem('shoppers_menu', 'si');
          this.spinnerService.hide();
          this.router.navigate(['dashboard'], {});
        }    
      },
      msg => { // Error
        this.spinnerService.hide();
        this.toastr.error(msg.error.error, 'Error', {
          timeOut: 5000
        });
      }
    );
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
