import { Component, OnInit } from '@angular/core';
import {CommonModule} from '@angular/common';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RutaService } from '../../services/ruta.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: 'usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  public primaryModal;
  public empleados:any;
  public empleado:any;
  public datos:any;
  public sucursales:any;
  public selected:any = [];
  public usuario:any={
    camp_crear:0,
    camp_editar:0,
    camp_ver:0,
    camp_eliminar:0,
    cuest_crear:0,
    cuest_editar:0,
    cuest_ver:0,
    cuest_eliminar:0,
    est_crear:0,
    est_editar:0,
    est_ver:0, 
    est_eliminar:0,
    email:'',
    password:'',
    nombre:'',
    empresa_id: localStorage.getItem('shoppers_usuario_id')
  };
  public registerUserForm: FormGroup;
  formErrors = {
    'nombre': '',
    'email': '',
    'password': ''
  };

  constructor(private http: HttpClient, private ruta: RutaService, private toastr: ToastrService, private builder: FormBuilder) { 
    this.sucursales = [{id:0,check:false,nombre:'Sucursal centro'}, {id:1,check:false,nombre:'Sucursal norte'}];
  }

  ngOnInit(): void {
    this.http.get(this.ruta.get_ruta()+'empleados/' + localStorage.getItem('shoppers_usuario_id'))
    .toPromise()
    .then(
    data => {
     this.empleados=data;
     this.empleados=this.empleados.empleados;
     console.log(this.empleados);
    },
    msg => { 
      this.toastr.warning(msg.error.error, 'Aviso', {
        timeOut: 5000
      });
    });
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
      cuest_editar: [0],
      cuest_ver: [0],
      cuest_eliminar: [0],
      est_crear: [0],
      est_editar: [0],
      est_ver: [0], 
      est_eliminar: [0],
      sucursales: [''],
      empresa_id: [localStorage.getItem('shoppers_usuario_id')]
    });
  }

  changePermiso(e,id){
     var send:any;
     for (var i = 0; i < this.empleados.length; i++) {
       if(this.empleados[i].id==id) {
         send=this.empleados[i];
         send.email=this.empleados[i].usuario.email;
       }
     }
     console.log(send);
     this.http.put(this.ruta.get_ruta()+'empleados/'+id,send)
     .toPromise()
     .then(
     data => {
       console.log(data);
      },
     msg => { 
       console.log(msg);
     });
  }

  changeSucursal(e,item){
    if(item.check){
      this.selected.push(item);
    } else {
      let index = this.selected.findIndex((item1) => item1.id === item.id);
      if(index !== -1){
        this.selected.splice(index, 1);
      }
    }
    console.log(this.selected);
  }

  createUser(){
    console.log(this.registerUserForm.value);
    /*this.http.post(this.ruta.get_ruta()+'empleados', this.usuario)
    .toPromise()
    .then(
    data => {
      this.datos = data;
      document.getElementById('modal-user').click();
      this.toastr.success(this.datos.message, 'Éxito', {
        timeOut: 5000
      });
    },
    msg => { 
      console.log(msg);
      this.toastr.error(msg.error.error, 'Error', {
        timeOut: 5000
      });
    });*/
  }
}
