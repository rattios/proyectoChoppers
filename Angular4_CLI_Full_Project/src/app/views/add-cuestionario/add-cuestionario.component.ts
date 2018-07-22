import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
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
  selector: 'app-add-cuestionario',
  templateUrl: './add-cuestionario.component.html',
  styleUrls: ['./add-cuestionario.component.scss','./foundation-theme.scss']
})
export class AddCuestionarioComponent implements OnInit {

	/* CREAR CAMPAÑAS */
	public campanas: any = [];
	public datosCampaign: any;
	public showCampaign: boolean = true;
	public Campaign: any = [];
	public cuestionarios: any = [];
	public datosBudget: any;
	public Budget: any = [];
	public num_cuestionario: number = 0;
	public pagoxcuest: number = 0;

	/* CREAR CUESTIONARIOS */
	public editBudgetForm: FormGroup;
	public tipo_cuestionario: string = 'Blanco';
	public answers: any = [];
	public question_unique: string = '';
	public question_open: string = '';
	public cuestionario = {
		nombre:'',
		preguntas: []
	}
	public answers_edit: any = [];
	public question_uniqueE: string = '';
	public question_openE: string = '';
	public question_reference: string = '';
	public answers_reference: any = [];
	public create_cuestionario = {
		cuestionario: '',
		estado_pago: 0,
		estado: 1,
		nombre: '',
		descripcion: ''
	}
	public sucursales:any = [];
	public sucursal_id: any;
  	
	constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
	}

	ngOnInit(): void {
		this.editBudgetForm = this.builder.group({
			campana_id: [''],
			cuestionario_id: ['']
		});
		this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
		this.sucursal_id = this.sucursales[0].id;
		this.getCampaign();
	}

	update_sucursal(event){
	    this.sucursal_id = event.target.value;
	    this.campanas = [];
	    this.cuestionarios = [];
	    this.num_cuestionario = 0;
	    this.pagoxcuest = 0;
	    this.editBudgetForm.patchValue({cuestionario_id: ''});
		this.cuestionario.nombre = '';
	    this.getCampaign();
	}

	getCampaign() {
	    this.http.get(this.ruta.get_ruta()+'sucursales/'+this.sucursal_id+'/campanas')
	    .toPromise()
	    .then(
	    data => {
		    this.datosCampaign = data;
		    this.Campaign = this.datosCampaign.sucursal.campanas;
		    if (this.Campaign != '') {
		    	for (var i = 0; i < this.Campaign.length; ++i) {
		    		if (this.Campaign[i].estado != 0) {
		    			this.campanas.push(this.Campaign[i]);
		    		}
		    	}
		      	this.editBudgetForm.patchValue({campana_id: this.campanas[0].id});
		      	this.getBudget();
	        } else {
		      this.toastr.error('No hay campañas con presupuesto asignado para esta sucursal', 'Error', {
		        timeOut: 5000
		      });
	        }
	    },
        msg => {
            this.toastr.error(msg.error.error,'Error', {
			    timeOut: 5000
			});
        });
	}

	getBudget() {
	    this.http.get(this.ruta.get_ruta()+'cuestionarios')
	    .toPromise()
	    .then(
	    data => {
		    this.datosBudget = data;
		    this.Budget = this.datosBudget.cuestionarios;
		    if (this.Budget != '') {
		    	for (var i = 0; i < this.Budget.length; ++i) {
		    		if (this.Budget[i].campana_id == this.editBudgetForm.value.campana_id && this.Budget[i].estado == 0) {
		    			this.Budget[i].nombre = JSON.parse(this.Budget[i].cuestionario).nombre;
		    			this.cuestionarios.push(this.Budget[i]);
		    		}
		    	}
		      	if (this.cuestionarios.length > 0) {
		      		this.editBudgetForm.patchValue({cuestionario_id: this.cuestionarios[0].id});
			      	this.cuestionario.nombre = this.cuestionarios[0].nombre;
			      	this.num_cuestionario = this.cuestionarios[0].num_cuestionarios;
			      	this.pagoxcuest = this.cuestionarios[0].pagoxcuest;
		      	}
	        } else {
		      this.toastr.error('No hay cuestionarios con presupuesto asignado para esta campaña', 'Error', {
		        timeOut: 5000
		      });
	        }
	    },
        msg => {
            this.toastr.error(msg.error.error,'Error', {
			    timeOut: 5000
			});
        });
	}


	setCampaign(ev){
		this.cuestionarios = [];
	    this.num_cuestionario = 0;
	    this.pagoxcuest = 0;
	    this.editBudgetForm.patchValue({cuestionario_id: ''});
		this.cuestionario.nombre = '';
		for (var i = 0; i < this.campanas.length; ++i) {
			if (this.campanas[i].id == ev.target.value) {
				this.editBudgetForm.patchValue({campana_id: ev.target.value});
				this.getBudget();
			}
		}
	}

	setCuestionario(ev){
		for (var i = 0; i < this.cuestionarios.length; ++i) {
			if (this.cuestionarios[i].id == ev.target.value) {
				this.editBudgetForm.patchValue({cuestionario_id: ev.target.value});
				this.cuestionario.nombre = this.cuestionarios[i].nombre;
		      	this.num_cuestionario = this.cuestionarios[i].num_cuestionarios;
		      	this.pagoxcuest = this.cuestionarios[i].pagoxcuest;
			}
		}
	}

	/* CUESTIONARIOS */
	addQuestion(){
		if (this.question_unique != '') {
			if (this.answers!=undefined && this.answers.length > 0) {
				let index = this.cuestionario.preguntas.findIndex((item) => item.pregunta === this.question_unique);
				if(index !== -1){
					this.toastr.error('Ya agregaste esta pregunta, por favor ingresa otra nueva','Error', {
			          timeOut: 5000
			        });
				} else {
					this.cuestionario.preguntas.push({pregunta: this.question_unique, respuestas: this.answers});
					this.answers = [];
					this.question_unique = '';
					this.question_uniqueE = '';
					this.question_reference = '';
					this.answers_edit = [];
				}
			} else {
				this.toastr.error('Debes asignar respuestas a la pregunta','Error', {
		          timeOut: 5000
		        });
			}
		} else {
			this.toastr.error('Debes completar el campo pregunta','Error', {
		        timeOut: 5000
		    });
		}
	}

	editQuestion(question){
		this.question_uniqueE = question.pregunta;
		this.question_reference = question.pregunta;
		this.answers_edit = question.respuestas;
	}

	updateQuestion(){
		if (this.question_uniqueE != '') {
			if (this.answers_edit!=undefined && this.answers_edit.length > 0) {
				for (var i = 0; i < this.cuestionario.preguntas.length; ++i) {
					if (this.cuestionario.preguntas[i].pregunta === this.question_reference) {
						this.cuestionario.preguntas[i].pregunta = this.question_uniqueE;
						this.cuestionario.preguntas[i].respuestas = this.answers_edit;
						document.getElementById('editU-campaign').click();
						this.question_uniqueE = '';
						this.question_reference = '';
						this.answers_edit = [];
					}
				}
			} else {
				this.toastr.error('Debes asignar respuestas a la pregunta','Error', {
		          timeOut: 5000
		        });
			}
		} else {
			this.toastr.error('Debes completar el campo pregunta','Error', {
		        timeOut: 5000
		    });
		}
	}

	deleteUQuestion(){
		let index = this.cuestionario.preguntas.findIndex((item) => item.pregunta === this.question_reference);
		if(index !== -1){
			this.cuestionario.preguntas.splice(index, 1);
			this.question_uniqueE = '';
			this.question_reference = '';
			this.answers_edit = [];
		}
	}

	editOQuestion(){
		this.question_openE = this.question_open;
	}

	updateOQuestion(){
		if (this.question_openE != '') {
			this.question_open = this.question_openE;
			document.getElementById('editO-campaign').click();
		} else {
			this.toastr.error('Debes completar el campo pregunta','Error', {
		        timeOut: 5000
		    });
		}
	}

	deleteOQuestion(){
		this.question_open = '';
		this.question_openE = '';
	}

	/** ENVIAR CAMPAÑA **/
	sendCampaign(){	
		if (this.cuestionario.nombre!='') {
			if (this.cuestionario.preguntas.length > 0) {
				if (this.question_open != '') {
					this.cuestionario.preguntas.push({pregunta: this.question_open, respuestas: ''});
				}
				this.spinnerService.show();
				this.create_cuestionario.cuestionario = JSON.stringify(this.cuestionario);
				this.create_cuestionario.nombre = this.cuestionario.nombre;
				this.http.put(this.ruta.get_ruta()+'cuestionarios/'+this.editBudgetForm.value.cuestionario_id, this.create_cuestionario)
		        .toPromise()
		        .then(
		        data => {
		          	this.spinnerService.hide();
		          	this.resetQuestion();
		        	this.router.navigate(['ver_cuestionarios'], {});
		          	this.toastr.success('Cuestionario publicado con éxito','Éxito', {
				        timeOut: 5000
				    });
		        },
		        msg => {
		        	this.spinnerService.hide(); 
		            this.toastr.error(msg.error.error,'Error', {
					    timeOut: 5000
					});
		        });	
			} else {
				this.toastr.error('Debe asignar al menos una pregunta al cuestionario','Error', {
			        timeOut: 5000
			    });
			    return false;
			}
		} else {
			this.toastr.error('Debe completar el campo nombre del cuestionario','Error', {
		        timeOut: 5000
		    });
		    return false;
		}
	}

	resetQuestion(){
		this.cuestionarios = [];
		this.getCampaign();
		this.cuestionario.preguntas = [];
		this.create_cuestionario.cuestionario = '';
		this.question_open = '';
		this.question_openE = '';
		this.question_uniqueE = '';
		this.question_reference = '';
		this.answers_edit = [];
	}

}
