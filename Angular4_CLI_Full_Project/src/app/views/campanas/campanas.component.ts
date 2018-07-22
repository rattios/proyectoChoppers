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
import * as moment from 'moment';

@Component({
  templateUrl: 'campanas.component.html',
  styleUrls: ['./campanas.component.css','./foundation-theme.scss']
})
export class CampanasComponent {
  	
	/* CREAR CAMPAÑAS */
	public editCampaignForm: FormGroup;
	public campanas: any = [];
	public datosCampaign: any;
	public showCampaign: boolean = true;
	public myMinVar = 0;
	public datos: any;
	public categorias: any;
	public preferences = [];
	public datos1: any;
	public estados: any = [];
	public selected_estados = [];
	public datos2: any;
	public municipios: any = [];
	public selected_municipios = [];
	public datos3: any;
	public colonias: any = [];
	public selected_colonias = [];
	public formErrors = {
		'nombre': '',
		'num_cuestionarios':'',
		'reembolso':''
	};

	public options: DatepickerOptions = {
	  displayFormat: 'DD/MM/YYYY',
	  barTitleFormat: 'MMMM YYYY',
	  dayNamesFormat: 'dd',
	  firstCalendarDay: 0,
	  locale: esLocale,
	  //minDate: new Date()
	};

	/* CREAR CUESTIONARIOS */
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
		campana_id: '',
		cuestionario: ''
	}

	/* PRESUPUESTOS */
	public editBudgetForm: FormGroup;
	public tarifa: number = 25;

	constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService, private sharedService: SharedService) {
		this.sharedService.sucursalData.subscribe(
	      (data: any) => {
	        this.getCampaign();
	    });
	}

	ngOnInit(): void {
		this.editCampaignForm = this.builder.group({
			nombre: [''],
			genero: ['Todos'],
			item: [''],
			f_inicio: [new Date()],
			f_fin: [new Date()],
			campana_id: [''],
			edad: ['0-100'],
			item_preference: [''],
			categorias: [''],
			estados: [''],
			municipios: [''],
			localidades: [''],
			presupuesto: [''],
			num_cuestionarios: [''],
			pagoxcuest: ['']
		});
		this.editBudgetForm = this.builder.group({
			presupuesto: ['100', [Validators.required]],
			num_cuestionarios: ['', [Validators.required]],
			pagoxcuest: ['', [Validators.required]],
			total: [0]
		});
		this.getCampaign();
		this.http.get(this.ruta.get_ruta()+'categorias')
		.toPromise()
		.then(
		data => {
			this.datos = data;
			this.categorias = this.datos.categorias;
			this.page();
		},
		msg => { 
			this.categorias = [];
			this.page();
		});
	}

	getCampaign() {
	    this.http.get(this.ruta.get_ruta()+'sucursales/'+localStorage.getItem('shopper_idSucursal')+'/campanas/nuevas')
	    .toPromise()
	    .then(
	    data => {
		    this.datosCampaign = data;
		    this.campanas = this.datosCampaign.sucursal.campanas;
		    if (this.campanas != '') {
		      this.editCampaignForm.patchValue({campana_id: this.campanas[0].id});
		      this.editCampaignForm.patchValue({nombre: this.campanas[0].nombre});
		      this.editBudgetForm.patchValue({presupuesto: this.campanas[0].presupuesto});
	        } else {
		      this.toastr.error('No hay campañas disponibles para publicar en esta Sucursal', 'Error', {
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

	showIcampaign(){
		this.showCampaign = !this.showCampaign;
		if (!this.showCampaign) {
			for (var i = 0; i < this.campanas.length; ++i) {
				if (this.campanas[i].id == this.editCampaignForm.value.campana_id) {
		      		this.editCampaignForm.patchValue({nombre: this.campanas[i].nombre});
				}
			}
		}
	}

	setCampaign(ev){
		for (var i = 0; i < this.campanas.length; ++i) {
			if (this.campanas[i].id == ev.target.value) {
				this.editCampaignForm.patchValue({campana_id: ev.target.value});
	      		this.editCampaignForm.patchValue({nombre: this.campanas[i].nombre});
	      		this.editBudgetForm.patchValue({presupuesto: this.campanas[i].presupuesto});
			}
		}
	}

	AgeFinish(ev){
		var rageAge = ev.from +"-"+ ev.to;
		this.editCampaignForm.patchValue({edad: rageAge});
	}

	changeGender(type){
		this.editCampaignForm.patchValue({genero: type});
	}

	changePreferences(e,item){
	    item.checked =! item.checked;
	    if(item.checked){
	      let index = this.preferences.findIndex((item1) => item1.id === item.id);
	      if(index == -1){
	        this.preferences.push(item);
	      }
	    } else {
	      let index1 = this.preferences.findIndex((item2) => item2.id === item.id);
	      if(index1 !== -1){
	        this.preferences.splice(index1, 1);
	      }
	    }
	}

	PreferenceRemoved(event){
		let index = this.preferences.findIndex((item) => item.id === event.id);
		if(index !== -1){
			this.preferences.splice(index, 1);
		}
		for (var i = 0; i < this.categorias.length; ++i) {
	      if (this.categorias[i].id == event.id) {
	        this.categorias[i].checked = false;
	      } 
	    }
	}

	page(){
	    this.http.get(this.ruta.get_ruta() + 'mx/get/estados')
	    .toPromise()
	    .then(
	      data => {
	        this.datos1 = data;
	        this.estados = this.datos1.estados; 
	      },
	      msg => {
	      	this.estados = [];
	      	this.toastr.error('No se pudo cargar las estados, intenta de nuevo','Error', {
		        timeOut: 5000
		    });
	    });
	}

	changeState(e,item){
	    item.checked =! item.checked;
	    if(item.checked){
	      let index = this.selected_estados.findIndex((item1) => item1.id === item.id);
	      if(index == -1){
	        this.selected_estados.push(item);
	        this.setMunicipios(item.id, false);
	      }
	    } else {
	      let index1 = this.selected_estados.findIndex((item2) => item2.id === item.id);
	      if(index1 !== -1){
	        this.selected_estados.splice(index1, 1);
	        this.setMunicipios(item.id, true);
	      }
	    }
	}

	StateRemoved(event){
		let index = this.selected_estados.findIndex((item) => item.id === event.id);
		if(index !== -1){
			this.selected_estados.splice(index, 1);
			this.setMunicipios(event.id, true);
		}
		for (var i = 0; i < this.estados.length; ++i) {
	      if (this.estados[i].id == event.id) {
	        this.estados[i].checked = false;
	      } 
	    }
	}

	setMunicipios(estado_id, exist){
		if (exist) {
        	var i = this.municipios.length;
			while (i--) {
			    if (this.municipios[i].estado_id == estado_id) {
			        this.municipios.splice(i, 1);
			    }
			}
		} else {
			this.http.get(this.ruta.get_ruta() + 'mx/get/municipios?estado_id='+estado_id)
		    .toPromise()
		    .then(
		      data => {
		        this.datos2 = data;
		        if (this.datos2 != '') {
		        	for (var i = 0; i < this.datos2.municipios.length; ++i) {
		        		this.municipios.push(this.datos2.municipios[i]);
		        	}
		        }
		      },
		      msg => {
		        this.toastr.error('No se pudo cargar los municipios, intenta de nuevo','Error', {
		          timeOut: 5000
		        });
		    });
		}   
	}

	changeCity(e,item){
	    item.checked =! item.checked;
	    if(item.checked){
	      let index = this.selected_municipios.findIndex((item1) => item1.id === item.id);
	      if(index == -1){
	        this.selected_municipios.push(item);
	        this.setColonias(item.id, false);
	      }
	    } else {
	      let index1 = this.selected_municipios.findIndex((item2) => item2.id === item.id);
	      if(index1 !== -1){
	        this.selected_municipios.splice(index1, 1);
	        this.setColonias(item.id, true);
	      }
	    }
	}

	CityRemoved(event){
		let index = this.selected_municipios.findIndex((item) => item.id === event.id);
		if(index !== -1){
			this.selected_municipios.splice(index, 1);
			this.setColonias(event.id, true);
		}
		for (var i = 0; i < this.municipios.length; ++i) {
	      if (this.municipios[i].id == event.id) {
	        this.municipios[i].checked = false;
	      } 
	    }
	}

	setColonias(municipio_id, exist){
		if (exist) {
        	var i = this.colonias.length;
			while (i--) {
			    if (this.colonias[i].estado_id == municipio_id) {
			        this.colonias.splice(i, 1);
			    }
			}
		} else {
			this.http.get(this.ruta.get_ruta() + 'mx/get/localidades?municipio_id='+municipio_id)
		    .toPromise()
		    .then(
		      data => {
		        this.datos3 = data;
		        if (this.datos3 != '') {
		        	for (var i = 0; i < this.datos3.localidades.length; ++i) {
		        		this.colonias.push(this.datos3.localidades[i]);
		        	}
		        }
		      },
		      msg => {
		        this.toastr.error('No se pudo cargar las colonias, intenta de nuevo','Error', {
		          timeOut: 5000
		        });
		    });
		}   
	}

	changeColonia(e,item){
	    item.checked =! item.checked;
	    if(item.checked){
	      let index = this.selected_colonias.findIndex((item1) => item1.id === item.id);
	      if(index == -1){
	        this.selected_colonias.push(item);
	      }
	    } else {
	      let index1 = this.selected_colonias.findIndex((item2) => item2.id === item.id);
	      if(index1 !== -1){
	        this.selected_colonias.splice(index1, 1);
	      }
	    }
	}

	ColoniaRemoved(event){
		let index = this.selected_colonias.findIndex((item) => item.id === event.id);
		if(index !== -1){
			this.selected_colonias.splice(index, 1);
			this.setColonias(event.id, true);
		}
		for (var i = 0; i < this.colonias.length; ++i) {
	      if (this.colonias[i].id == event.id) {
	        this.colonias[i].checked = false;
	      } 
	    }
	}

	step_main: (MovingDirection) => boolean = (direction) => {
    	return this.checkStep();
  	}

  	checkStep(): boolean {
	    if (moment(this.editCampaignForm.value.f_fin).format("YYYY-MM-DD") >= moment(this.editCampaignForm.value.f_inicio).format("YYYY-MM-DD")) {
			return true;
		} else {
			this.toastr.error('La Fecha Fin de Campaña no puede ser menor a la Fecha Inicio','Error', {
			    timeOut: 5000
			});
		    return false;
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

	step_question: (MovingDirection) => boolean = (direction) => {
    	return this.checkStep2();
  	}

  	checkStep2(): boolean {
	    if (this.cuestionario.nombre!='') {
			if (this.cuestionario.preguntas.length > 0) {
				return true;
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

	/** PRESUPUESTO **/
	changeBudget(){
		var subtotal = this.editBudgetForm.value.num_cuestionarios * this.editBudgetForm.value.pagoxcuest;
		var total_tarifa = this.editBudgetForm.value.num_cuestionarios * this.tarifa;
		var total = subtotal + total_tarifa;
		if (total > this.editBudgetForm.value.presupuesto) {
			this.toastr.error('El monto total no debe ser mayor al presupuesto disponible','Error', {
		        timeOut: 5000
		    });
		} else {
			this.editBudgetForm.patchValue({total: total});
			var total_presupuesto = this.editBudgetForm.value.presupuesto - total;
			this.editCampaignForm.patchValue({presupuesto: total_presupuesto});
		}
		
	}

	step_budget: (MovingDirection) => boolean = (direction) => {
    	return this.checkStep3();
  	}

  	checkStep3(): boolean {
	    if (this.editBudgetForm.valid) {
			if (this.editBudgetForm.value.total > this.editBudgetForm.value.presupuesto) {
				this.toastr.error('El monto total no debe ser mayor al presupuesto disponible','Error', {
			        timeOut: 5000
			    });
			    return false;
			} else {
				return true;
			}
		} else {
			this.toastr.error('Debe completar todos los campos','Error', {
		        timeOut: 5000
		    });
		    return false;
		}
	}

	/** ENVIAR CAMPAÑA **/
	sendCampaign(){
		this.spinnerService.show();
		this.editCampaignForm.patchValue({categorias: JSON.stringify(this.preferences)});
		this.editCampaignForm.patchValue({estados: JSON.stringify(this.selected_estados)});
		this.editCampaignForm.patchValue({municipios: JSON.stringify(this.selected_municipios)});
		this.editCampaignForm.patchValue({localidades: JSON.stringify(this.selected_colonias)});
		this.editCampaignForm.patchValue({num_cuestionarios: this.editBudgetForm.value.num_cuestionarios});
		this.editCampaignForm.patchValue({pagoxcuest: this.editBudgetForm.value.pagoxcuest});
		this.create_cuestionario.campana_id = this.editCampaignForm.value.campana_id;
		this.create_cuestionario.cuestionario = JSON.stringify(this.cuestionario);

		this.http.put(this.ruta.get_ruta()+'campanas/'+this.editCampaignForm.value.campana_id, this.editCampaignForm.value)
        .toPromise()
        .then(
        data => {
          	this.http.post(this.ruta.get_ruta()+'cuestionarios', this.create_cuestionario)
	        .toPromise()
	        .then(
	        data => {
	        	this.spinnerService.hide();
	        	this.router.navigate(['ver_campanas'], {});
	          	this.toastr.success('Campaña publicada con éxito','Éxito', {
			        timeOut: 5000
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
	}
}
