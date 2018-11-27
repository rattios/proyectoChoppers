import { Component } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent { 

	constructor(private permissionsService: NgxPermissionsService) {    
    	if (localStorage.getItem('shoppers_permis') == null || localStorage.getItem('shoppers_permis') == '') {
    		localStorage.setItem('shoppers_permis', JSON.stringify([]));
    	} else {
        var perm2 = JSON.parse(localStorage.getItem('shoppers_permis'));
        this.permissionsService.loadPermissions(perm2);
      }
  	}

}
