import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { RutaService } from '../../services/ruta.service';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public usuario:any;
  public empresa:any;
  public result:any;
  public isRegistrar=false;
  constructor(private http: HttpClient, private router: Router, private ruta: RutaService) {
    this.usuario={
    		email:'',
    		password:''
     }
    this.empresa={
        nombre:'',
        email:'',
        password:'',
        categoria:1
    }
  }
  verRegistrar(){
    if( this.isRegistrar!=true) {
      this.isRegistrar=true;
    }else{
      this.isRegistrar=false;
    }
  }

  registrar(){
    // http://shopper.internow.com.mx/shoppersAPI/public/empresas
    this.http.post(this.ruta.get_ruta()+'empresas', this.empresa)
        .toPromise()
        .then(
          data => { // Success
            console.log(data);
            alert('Se ha registrado con éxito!');
            this.http.post(this.ruta.get_ruta()+'login/web', this.empresa)
              .toPromise()
              .then(
                data => { // Success
                  console.log(data);
                  this.result=data;
                  console.log(this.result.token);
                  localStorage.setItem('shoppers_token', this.result.token);
                  localStorage.setItem('shoppers_nombre', this.result.user.nombre);
                  localStorage.setItem('shoppers_usuario_id', this.result.user.id);
                  localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
                  this.router.navigate(['usuarios'], {});
               },
                msg => { // Error
                  console.log(msg);
                  alert(JSON.stringify(msg));
                }
              );
         },
          msg => { // Error
            console.log(msg);
            alert(JSON.stringify(msg));
          }
        );
  }

  login(){
  	console.log(this.usuario);
  	console.log(this.ruta.get_ruta()+'login/web');
  	this.http.post(this.ruta.get_ruta()+'login/web', this.usuario)
        .toPromise()
        .then(
          data => { // Success
            console.log(data);
            this.result=data;
            console.log(this.result.token);
            localStorage.setItem('shoppers_token', this.result.token);
            localStorage.setItem('shoppers_nombre', this.result.user.nombre);
            localStorage.setItem('shoppers_usuario_id', this.result.user.id);
            localStorage.setItem('shoppers_tipo_usuario', this.result.user.tipo_usuario);
            this.router.navigate(['usuarios'], {});
         },
          msg => { // Error
          	console.log(msg);
          	alert(JSON.stringify(msg));
          }
        );
	}
}
