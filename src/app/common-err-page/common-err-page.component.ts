
import { Component, OnInit,Inject } from "@angular/core";
import { ActivatedRoute, RouterModule,Router } from '@angular/router';


@Component({
    selector: 'ds-common-err-page',
    styleUrls: ['./common-err-page.component.scss'],
    templateUrl: './common-err-page.component.html',
  })

  export class CommonErrPageComponent implements OnInit{
    constructor( private router : Router){}
  ngOnInit(): void {
  }
    
  redirectToHome(){
    this.router.navigate['/home']
  }
    
  }