import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams  } from '@angular/common/http';

@Component({
  templateUrl: 'principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent {

  constructor(private http: HttpClient, private router: Router) {
    
  }

  login(){
  	this.router.navigate(['login']);
  }
  
}
