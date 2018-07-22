import { Component } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent { 

	constructor(private permissionsService: NgxPermissionsService) { 
    	console.log(localStorage.getItem('shoppers_permis'));
    	if (localStorage.getItem('shoppers_permis') != '' ) {
    		var perm2 = JSON.parse(localStorage.getItem('shoppers_permis'));
        //const perm2 = ["EMPRESA"];
	    	this.permissionsService.loadPermissions(perm2);
    	}
  	}

}
