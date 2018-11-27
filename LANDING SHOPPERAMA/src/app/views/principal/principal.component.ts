import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  public datos: any;
  public datos1: any;
  public categorias: any = [];
  public contactUserForm: FormGroup;
  formErrors = {
    'name': '',
    'email': '',
    'phone': '',
    'msg': ''
  };
  
  constructor(private http: HttpClient, private builder: FormBuilder, private router: Router, private ruta: RutaService, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {  
  }

  ngOnInit(): void {
    this.initCategorias();
    this.initForm();  
  }

  initForm() {
    this.contactUserForm = this.builder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      msg: ['', [Validators.required]]
    });
    this.contactUserForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  };

  initCategorias(){
    this.http.get(this.ruta.get_ruta()+'categorias')
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.categorias = this.datos.categorias;
    },
    msg => { 
      this.categorias = [];
    });
  };

  onValueChanged(data?: any) {
    if (!this.contactUserForm) { return; }
    const form = this.contactUserForm;

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
  };

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
  };

  senContact(){
    this.contactUserForm.patchValue({email: this.contactUserForm.value.email.toLowerCase()});
    if (this.contactUserForm.valid) {
      this.spinnerService.show();
      this.http.post(this.ruta.get_ruta()+'emails/contact', this.contactUserForm.value)
      .toPromise()
      .then(
        data => { // Success
          console.log(data);
          this.datos1 = data;
          this.spinnerService.hide();
          this.clearForm();
          this.toastr.success(this.datos1.message, 'Éxito', {
            timeOut: 5000
          });
       },
        msg => { // Error
          this.spinnerService.hide();
          this.toastr.error(msg.error.error, 'Error', {
            timeOut: 5000
          });
        }
      );
    } else {
      this.validateAllFormFields(this.contactUserForm);
      this.toastr.error('¡Debes completar todos los campos!', 'Error', {
        timeOut: 5000
      });
    }
  };

  clearForm(){
    this.contactUserForm.patchValue({name: ''});
    this.contactUserForm.patchValue({email: ''});
    this.contactUserForm.patchValue({phone: ''});
    this.contactUserForm.patchValue({msg: ''});
  }
  
}
