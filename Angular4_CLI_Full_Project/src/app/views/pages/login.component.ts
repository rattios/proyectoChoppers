import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/toPromise';

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
  
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService) {
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
      this.http.post(this.ruta.get_ruta()+'empresas', this.registerUserForm.value)
      .toPromise()
      .then(
        data => { // Success
          this.toastr.success('Tu empresa ha sido registrada con éxito', '¡Bienvenido a Shopper!', {
            timeOut: 5000
          });
          this.http.post(this.ruta.get_ruta()+'login/web', this.registerUserForm.value)
            .toPromise()
            .then(
              data => { // Success
                this.result=data;
                localStorage.setItem('shoppers_token', this.result.token);
                localStorage.setItem('shoppers_nombre', this.result.user.nombre);
                localStorage.setItem('shoppers_usuario_id', this.result.user.empresa.id);
                localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
                localStorage.setItem('shoppers_menu', 'no');
                this.router.navigate(['configuracion'], {});
             },
              msg => { // Error
                this.toastr.error(msg.error.error, 'Error', {
                  timeOut: 5000
                });
              }
            );
       },
        msg => { // Error
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
  	this.http.post(this.ruta.get_ruta()+'login/web', this.usuario)
        .toPromise()
        .then(
          data => { // Success
            console.log(data);
            this.result=data;
            localStorage.setItem('shoppers_token', this.result.token);
            localStorage.setItem('shoppers_nombre', this.result.user.nombre);
            localStorage.setItem('shoppers_usuario_id', this.result.user.empresa.id);
            localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
            localStorage.setItem('shoppers_email', this.result.user.email);
            if(this.result.user.empresa.sucursales == '' && this.result.user.tipo_usuario == 2){
              this.router.navigate(['configuracion'], {});
              localStorage.setItem('shoppers_menu', 'no');
            } else {
              this.router.navigate(['dashboard'], {});
              localStorage.setItem('shoppers_menu', 'si');
            }
            
         },
          msg => { // Error
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
