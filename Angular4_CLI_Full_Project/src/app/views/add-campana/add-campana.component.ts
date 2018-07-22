import { Component, OnInit, ViewChild } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Observable, Observer } from 'rxjs';
import { DatepickerOptions } from 'ng2-datepicker';
import * as esLocale from 'date-fns/locale/es';
import * as moment from 'moment';

@Component({
  selector: 'app-add-campana',
  templateUrl: './add-campana.component.html',
  styleUrls: ['./add-campana.component.scss','./foundation-theme.scss']
})
export class AddCampanaComponent implements OnInit {

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
	public sucursales = [];
	public selected: any = [];
	public isSelected = false;
	public formErrors = {
		'nombre': '',
		'num_cuestionarios':'',
		'reembolso':''
	};
	public date = new Date();
	public date2 = new Date();
	public options: DatepickerOptions = {
	  displayFormat: 'DD/MM/YYYY',
	  barTitleFormat: 'MMMM YYYY',
	  dayNamesFormat: 'dd',
	  firstCalendarDay: 0,
	  locale: esLocale,
	  minDate: this.date
	};
	public options2: DatepickerOptions = {
	  displayFormat: 'DD/MM/YYYY',
	  barTitleFormat: 'MMMM YYYY',
	  dayNamesFormat: 'dd',
	  firstCalendarDay: 0,
	  locale: esLocale,
	  minDate: this.date2
	};
  	
	constructor(private http: HttpClient, private router: Router, private ruta: RutaService, private builder: FormBuilder, private toastr: ToastrService, private spinnerService: Ng4LoadingSpinnerService) {
	}

	ngOnInit(): void {
		this.date.setDate(this.date.getDate() - 1);
		this.date2.setDate(this.date2.getDate() - 1);
		this.editCampaignForm = this.builder.group({
			nombre: [''],
			genero: ['Todos'],
			item: [''],
			sucursales: [''],
			presupuesto: [0],
			saldo: [0],
			presupuesto_max: [0],
			f_inicio: [new Date()],
			f_fin: [new Date()],
			edad: [null],
			item_preference: [''],
			categorias: [''],
			estados: [''],
			municipios: [''],
			localidades: [''],
			estado:[0],
			empresa_id: [localStorage.getItem('shoppers_empresa_id')],
			nombre_empleado: [localStorage.getItem('shoppers_nombre')],
			token: [localStorage.getItem('shoppers_token')]
		});
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
		this.sucursales = JSON.parse(localStorage.getItem('shoppers_sucursales'));
	}

	changeSucursal(e,item){
	    item.check=!item.check;
	    if(item.check){
	      let index = this.selected.findIndex((item1) => item1.id === item.id);
	      if(index == -1){
	        this.selected.push(item);
	      }
	    } else {
	      let index1 = this.selected.findIndex((item2) => item2.id === item.id);
	      if(index1 !== -1){
	        this.selected.splice(index1, 1);
	      }
	    }
	    if (this.selected.length == this.sucursales.length && this.selected.length > 0) {
	      this.isSelected = true;
	    }
	    if (this.selected.length == 0) {
	      this.isSelected = false;
	    }
	}

	checkAll(ev) {
		this.selected = [];
		if (ev.target.checked) {
		  for (var i = 0; i < this.sucursales.length; ++i) {
		    this.sucursales[i].check = true;
		    this.selected.push(this.sucursales[i]);
		  }
		} else {
		  for (var i = 0; i < this.sucursales.length; ++i) {
		    this.sucursales[i].check = false;
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
	    var j = this.selected_municipios.length;
		while (j--) {
		    if (this.selected_municipios[j].estado_id == event.id) {
		        this.selected_municipios.splice(j, 1);
		    }
		}
		var z = this.selected_colonias.length;
		while (z--) {
		    if (this.selected_colonias[z].estado_id == event.id) {
		        this.selected_colonias.splice(z, 1);
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
			this.http.get(this.ruta.get_ruta() + 'mx/get/localidades/plus?municipio_id='+municipio_id)
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

	/** ENVIAR CAMPAÑA **/
	sendCampaign(){
		if (moment(this.editCampaignForm.value.f_fin).format("YYYY-MM-DD") >= moment(this.editCampaignForm.value.f_inicio).format("YYYY-MM-DD")) {
			if (this.selected != '') {
				document.getElementById('modal-confirm').click();
				this.spinnerService.show();
	        	this.editCampaignForm.patchValue({sucursales: JSON.stringify(this.selected)});
				this.editCampaignForm.patchValue({categorias: JSON.stringify(this.preferences)});
				this.editCampaignForm.patchValue({estados: JSON.stringify(this.selected_estados)});
				this.editCampaignForm.patchValue({municipios: JSON.stringify(this.selected_municipios)});
				this.editCampaignForm.patchValue({localidades: JSON.stringify(this.selected_colonias)});
				let headers = new HttpHeaders();
      			headers = headers.append("Authorization", "Bearer " + localStorage.getItem('shoppers_token'));
				this.http.post(this.ruta.get_ruta()+'campanas?token='+localStorage.getItem('shoppers_token'), this.editCampaignForm.value)
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
		        	console.log(msg);
		            this.toastr.error(msg.error.error,'Error', {
					    timeOut: 5000
					});
		        });
	    	} else {
		        this.toastr.error('¡Debes asignar al menos una sucursal!', 'Error', {
		          timeOut: 5000
		        }); 
		    }
		} else {
			this.toastr.error('La Fecha Fin de Campaña no puede ser menor a la Fecha Inicio','Error', {
			    timeOut: 5000
			});
		}
	}

}
