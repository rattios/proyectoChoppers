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
  templateUrl: 'tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent {

  public datos: any;
  public tarifaForm: FormGroup;
  formErrors1 = {
    'tarifa': ''
  };

  constructor(private http: HttpClient, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
    this.initEditForm();
  }

  ngOnInit(): void {
    this.initCompany();  
  }

  initCompany(){
    this.http.get(this.ruta.get_ruta()+'sistema/tarifa')
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.tarifaForm.patchValue({tarifa: this.datos.tarifa.tarifa});
    },
    msg => { 
    });
  }

  initEditForm(){
    this.tarifaForm = this.builder.group({
      tarifa: ['', [Validators.required]]
    });
    this.tarifaForm.valueChanges.subscribe(data => this.onValueChanged1(data));
    this.onValueChanged1();
  }

  updateTarifa(){
    this.spinnerService.show();
    this.http.put(this.ruta.get_ruta()+'sistema/tarifa/1', this.tarifaForm.value)
    .toPromise()
    .then(
    data => {
      this.datos = data;
      this.spinnerService.hide();
      this.toastr.success(this.datos.message, 'Éxito', {
        timeOut: 5000
      });
    },
    msg => { 
    });
  }


  onValueChanged1(data?: any) {
    if (!this.tarifaForm) { return; }
    const form = this.tarifaForm;

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

 
  addCategory(){
    if (this.tarifaForm.valid) {
      this.spinnerService.show();
      this.http.post(this.ruta.get_ruta()+'categorias', this.tarifaForm.value)
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
      this.validateAllFormFields1(this.tarifaForm);
      this.toastr.error('¡Complete el nombre e imagen de la preferencia!', 'Error', {
        timeOut: 5000
      });
    };
  };
}
