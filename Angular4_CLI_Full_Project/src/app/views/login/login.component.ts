import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
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
  
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private permissionsService: NgxPermissionsService) {
    this.usuario = {
    	email:'',
    	password:'',
      token_notificacion: ''
    }

    let OneSignal = window['OneSignal'] || [];
    
    OneSignal.push(["init", {
      appId: "32500e5f-2def-4a7a-96bf-541ceb67df76",
      autoRegister: true,
      subdomainName: 'https://shopper-intern.os.tc',

      httpPermissionRequest: {
        enable: true,
        modalTitle: 'Shopperama',
        modalMessage: 'Gracias por suscribirse a las notificaciones!',
        modalButtonText:'OK'

      },
      welcomeNotification:{
         "title": "Shopperama",
        "message": "Gracias por suscribirse a las notificaciones!"
      },
      notifyButton: {
          enable: false 
      }
    }]);
    OneSignal.push(function() {
      OneSignal.getUserId(function(userId) {
        localStorage.setItem('shoppers_token_notificacion', userId);
        console.log(userId);
      });
    });
    this.initCategory();
  }
  
  initCategory() {
    this.registerUserForm = this.builder.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      token_notificacion: ['']
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
    this.registerUserForm.patchValue({email: this.registerUserForm.value.email.toLowerCase()});
    this.registerUserForm.patchValue({token_notificacion: localStorage.getItem('shoppers_token_notificacion')});
    if (this.registerUserForm.valid) {
      this.spinnerService.show();
      this.http.post(this.ruta.get_ruta()+'empresas', this.registerUserForm.value)
      .toPromise()
      .then(
        data => { // Success
          this.login(this.registerUserForm.value);
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

  login(user){
    this.spinnerService.show();
    this.usuario.token_notificacion = localStorage.getItem('shoppers_token_notificacion');
  	this.http.post(this.ruta.get_ruta()+'login/web', user)
    .toPromise()
    .then(
      data => { // Success
        console.log(data);
        this.result=data;
        localStorage.setItem('shoppers_token', this.result.token);
        localStorage.setItem('shoppers_nombre', this.result.user.nombre); 
        localStorage.setItem('shoppers_id', this.result.user.id);     
        localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
        localStorage.setItem('shoppers_email', this.result.user.email);
        if(this.result.user.tipo_usuario == 2){
          const perm = ["EMPRESA"];
          this.permissionsService.flushPermissions();
          this.permissionsService.loadPermissions(perm);
          localStorage.setItem('shoppers_usuario_id', this.result.user.empresa.id);
          localStorage.setItem('shoppers_empresa_id', this.result.user.empresa.id);
          localStorage.setItem('shoppers_imagen', this.result.user.empresa.imagen);
          localStorage.setItem('shoppers_permis', JSON.stringify(perm));
          localStorage.setItem('shopper_permisos', '');
          if (this.result.user.empresa.sucursales == '') {
            localStorage.setItem('shoppers_menu', 'no');
            localStorage.setItem('shoppers_sucursales', '');
            localStorage.setItem('shoppers_imagen', '');
            this.spinnerService.hide();
            this.router.navigate(['configuracion'], {});
          } else {
            localStorage.setItem('shoppers_menu', 'si');
            localStorage.setItem('shoppers_sucursales', JSON.stringify(this.result.user.empresa.sucursales));
            this.spinnerService.hide();
            this.router.navigate(['dashboard'], {});
          } 
        }  
        if(this.result.user.tipo_usuario == 3){
          localStorage.setItem('shoppers_usuario_id', this.result.user.empleado.id);
          localStorage.setItem('shoppers_sucursales', JSON.stringify(this.result.user.empleado.sucursales));
          localStorage.setItem('shoppers_empresa_id', this.result.user.empleado.sucursales[0].empresa_id);
          localStorage.setItem('shopper_permisos', JSON.stringify(this.result.user.empleado.permisos));
          localStorage.setItem('shoppers_menu', 'si');
          const perm2 = ["EMPLEADO"];
          var permiss = ["EMPLEADO"];
          this.permissionsService.flushPermissions();
          this.permissionsService.loadPermissions(perm2);
          // campañas
          if (this.result.user.empleado.permisos.camp_crear == 1) {
            this.permissionsService.addPermission('CAMP_CREAR');
            permiss.push('CAMP_CREAR');
          }
          if (this.result.user.empleado.permisos.camp_editar == 1) {
            this.permissionsService.addPermission('CAMP_EDIT');
            permiss.push('CAMP_EDIT');
          }
          if (this.result.user.empleado.permisos.camp_ver == 1) {
            this.permissionsService.addPermission('CAMP_VER');
            permiss.push('CAMP_VER');
          }
          if (this.result.user.empleado.permisos.camp_eliminar == 1) {
            this.permissionsService.addPermission('CAMP_DELETE');
            permiss.push('CAMP_DELETE');
          }
          //cuestionarios
          if (this.result.user.empleado.permisos.cuest_crear == 1) {
            this.permissionsService.addPermission('CUEST_CREAR');
            permiss.push('CUEST_CREAR');
          }
          if (this.result.user.empleado.permisos.cuest_eidtar == 1) {
            this.permissionsService.addPermission('CUEST_EDIT');
            permiss.push('CUEST_EDIT');
          }
          if (this.result.user.empleado.permisos.cuest_ver == 1) {
            this.permissionsService.addPermission('CUEST_VER');
            permiss.push('CUEST_VER');
          }
          if (this.result.user.empleado.permisos.cuest_eliminar == 1) {
            this.permissionsService.addPermission('CUEST_DELETE');
            permiss.push('CUEST_DELETE');
          }
          localStorage.setItem('shoppers_permis', JSON.stringify(permiss));
          this.spinnerService.hide();
          this.router.navigate(['dashboard'], {});
        }
        if(this.result.user.tipo_usuario == 4){
          const perm = ["ADMIN"];
          this.permissionsService.flushPermissions();
          this.permissionsService.loadPermissions(perm);
          localStorage.setItem('shoppers_permis', JSON.stringify(perm));
          localStorage.setItem('shoppers_menu', 'si');
          localStorage.setItem('shoppers_usuario_id', this.result.user.id);
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
