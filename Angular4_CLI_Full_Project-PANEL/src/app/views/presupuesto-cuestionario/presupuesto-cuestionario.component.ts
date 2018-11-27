import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { SharedService } from '../../services/sucursales.service';
import { Observable, Observer } from 'rxjs';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';

@Component({
  selector: 'app-presupuesto-cuestionario',
  templateUrl: './presupuesto-cuestionario.component.html',
  styleUrls: ['./presupuesto-cuestionario.component.scss']
})
export class presupuestoCuestionarioComponent implements OnInit {

	/* PRESUPUESTOS */
	public datosCampaign:any;
	public Campaign:any;
	public campanas:any = [];
	public BudgetForm: FormGroup;
	public EditCampaignForm: FormGroup;
	public tarifa: number = 0;
	public presupuesto_max: number = 0;
	public saldo: number = 0;
	public datos: any;
	public datos1: any;
	public formErrors = {
		'nombre': '',
		'num_cuestionarios':'',
		'pagoxcuest':''
	};
	public cuestionario = {
		nombre:'',
		preguntas: []
	}
	public param_notification = {
	    empresa_id: localStorage.getItem('shoppers_usuario_id'),
	    nombre_cuestionario: ''
	}
	public sucursales:any = [];
	public sucursal_id: any;
  	
	constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
	}

	ngOnInit(): void {
		this.EditCampaignForm = this.builder.group({
			presupuesto: [0],
			saldo: [0],
			estado: [2]
		});
		this.BudgetForm = this.builder.group({
			nombre: ['', [Validators.required]],
			cuestionario: [''],
			num_cuestionarios: ['', [Validators.required]],
			pagoxcuest: ['', [Validators.required]],
			total: [0],
			campana_id: [''],
			estado_pago: [0],
			comision: [''],
			estado: [0],
			token: [localStorage.getItem('shoppers_token')]
		});
		this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
		this.sucursal_id = this.sucursales[0].id;
		this.getCampaign();
		this.BudgetForm.valueChanges.subscribe(data => this.onValueChanged(data));
    	this.onValueChanged();
	}

	getCampaign() {
	    this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas')
	    .toPromise()
	    .then(
	    data => {
		    this.datosCampaign = data;;
		    this.Campaign = this.datosCampaign.sucursal.campanas;
		    if (this.Campaign.length > 0) {
		    	for (var i = 0; i < this.Campaign.length; ++i) {
		    		if (this.Campaign[i].estado != 0) {
		    			this.campanas.push(this.Campaign[i]);
		    		}
		    	}
		      	this.BudgetForm.patchValue({campana_id: this.Campaign[0].id});
		      	this.presupuesto_max = this.Campaign[0].presupuesto;
		      	this.saldo = this.Campaign[0].saldo;
	        } else {
		      this.toastr.error('No hay campañas con presupuesto asignado para esta sucursal', 'Error', {
		        timeOut: 5000
		      });
	        }
	        this.getComision();
	    },
	    msg => { 
	      this.toastr.warning(msg.error.error, 'Aviso', {
	        timeOut: 5000
	      });
	      this.getComision();
	    });
	}

	getComision() {
	    this.http.get(this.ruta.get_ruta()+'sistema/tarifa')
	    .toPromise()
	    .then(
	    data => {
		    this.datos1 = data;
		    this.tarifa = this.datos1.tarifa.tarifa;
		    this.BudgetForm.patchValue({comision: this.tarifa});
	    },
	    msg => { 
	      this.toastr.warning(msg.error.error, 'Aviso', {
	        timeOut: 5000
	      });
	    });
	}

	setCampaign(ev){
		for (var i = 0; i < this.campanas.length; ++i) {
			if (this.campanas[i].id == ev.target.value) {
				this.BudgetForm.patchValue({campana_id: ev.target.value});
				this.presupuesto_max = this.campanas[i].presupuesto;
		      	this.saldo = this.campanas[i].saldo;
			}
		}
	}

	update_sucursal(event){
	    this.sucursal_id = event.target.value;
	    this.campanas = [];
	    this.getCampaign();
	}

	/** PRESUPUESTO **/
	changeBudget1(){
		var subtotal = this.BudgetForm.value.num_cuestionarios * this.BudgetForm.value.pagoxcuest;
		var total_tarifa = this.BudgetForm.value.num_cuestionarios * this.tarifa;
		var total = subtotal + total_tarifa;
		if (total > this.presupuesto_max) {
			this.toastr.error('El monto total no debe ser mayor al presupuesto disponible','Error', {
		        timeOut: 5000
		    });
		    this.BudgetForm.patchValue({num_cuestionarios: ''});
		    this.BudgetForm.patchValue({total: 0});
		} else {
			this.BudgetForm.patchValue({total: total});
			var total_presupuesto = this.presupuesto_max - total;
			this.EditCampaignForm.patchValue({presupuesto: total_presupuesto});
			var total_saldo = this.saldo + total;
			this.EditCampaignForm.patchValue({saldo: total_saldo});
		}
		
	}

	changeBudget2(){
		var subtotal = this.BudgetForm.value.num_cuestionarios * this.BudgetForm.value.pagoxcuest;
		var total_tarifa = this.BudgetForm.value.num_cuestionarios * this.tarifa;
		var total = subtotal + total_tarifa;
		if (total > this.presupuesto_max) {
			this.toastr.error('El monto total no debe ser mayor al presupuesto disponible','Error', {
		        timeOut: 5000
		    });
		    this.BudgetForm.patchValue({pagoxcuest: ''});
		    this.BudgetForm.patchValue({total: total_tarifa});
		} else {
			this.BudgetForm.patchValue({total: total});
			var total_presupuesto = this.presupuesto_max - total;
			this.EditCampaignForm.patchValue({presupuesto: total_presupuesto});
			var total_saldo = this.saldo + total;
			this.EditCampaignForm.patchValue({saldo: total_saldo});
		}
		
	}

	/** ENVIAR CAMPAÑA **/
	sendCampaign(){
		if (this.BudgetForm.valid) {
			this.spinnerService.show();
			this.cuestionario.nombre = this.BudgetForm.value.nombre;
			this.param_notification.nombre_cuestionario = this.BudgetForm.value.nombre;
			this.BudgetForm.patchValue({cuestionario: JSON.stringify(this.cuestionario)});
			let headers = new HttpHeaders();
      			headers = headers.append("Authorization", "Bearer " + localStorage.getItem('shoppers_token'));
			this.http.post(this.ruta.get_ruta()+'cuestionarios?token='+localStorage.getItem('shoppers_token'), this.BudgetForm.value, {
            	headers: headers
        	})
	        .toPromise()
	        .then(
	        data => {
			    this.http.put(this.ruta.get_ruta()+'campanas/'+this.BudgetForm.value.campana_id, this.EditCampaignForm.value)
		        .toPromise()
		        .then(
		        data => {
		          	this.spinnerService.hide();
		          	this.resetPresupuesto();
		          	this.toastr.success('El presupuesto al cuestionario se ha asignado con éxito','Éxito', {
				        timeOut: 5000
				    });
				    this.http.post(this.ruta.get_ruta() + 'notificaciones/crear/cuestionarios', this.param_notification)
					.toPromise()
					.then(
						data => {
						this.datos = data;
						this.toastr.success(this.datos.message, 'Éxito', {
						  timeOut: 5000
						});
					},
					msg => { 
						console.log(msg.error.error);
					});
		        },
		        msg => {
		        	this.spinnerService.hide(); 
		            this.toastr.error(msg.error.error,'Error', {
					    timeOut: 5000
					});
		        });	
	        },
	        msg => {
	        	this.spinnerService.hide(); 
	            this.toastr.error(msg.error.error,'Error', {
				    timeOut: 5000
				});
	        });
		} else {
			this.validateAllFormFields(this.BudgetForm);
	        this.toastr.error('¡Faltan datos para el presupuesto!', 'Error', {
	          timeOut: 5000
	        });
		}
	}

	resetPresupuesto(){
		this.presupuesto_max = 0;
		this.saldo = 0;
		this.campanas = [];
	    this.EditCampaignForm = this.builder.group({
			presupuesto: [0],
			saldo: [0],
			estado: [2]
		});
		this.BudgetForm = this.builder.group({
			nombre: ['', [Validators.required]],
			cuestionario: [''],
			num_cuestionarios: ['', [Validators.required]],
			pagoxcuest: ['', [Validators.required]],
			total: [0],
			campana_id: [''],
			estado_pago: [0],
			comision: [this.tarifa],
			estado: [0],
			token: [localStorage.getItem('shoppers_token')]
		});
	    this.getCampaign();
	}

	onValueChanged(data?: any) {
		if (!this.BudgetForm) { return; }
		const form = this.BudgetForm;
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
