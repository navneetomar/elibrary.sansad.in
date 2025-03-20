import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

import { getCommonErrPageRoute } from '../../app-routing-paths';
import { CommonErrService } from "./common-err.service";
export const ERR_PAGE = '/err';

const PATTERN="<[^>]*";
const PATTERNFORHATCH="#";

@Injectable()



export class CommonErrInterceptor implements HttpInterceptor {
    public hideHeader: boolean = true;
    

    constructor(private router: Router, private commonService: CommonErrService) { 
     
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
               
                // getCommonErrPageRoute()
                //    this.hideHeader = true
                
                if(this.testRegex(this.router.url)){
                    this.router.navigate([ERR_PAGE]);
                }
            
                this.commonService.setHeaderVisbility(false) 
              
                let errResp: any = error.status == 502 || error.status == 403 ||error.status==500 
                
               
                if(this.router.url!="/home" ){
                if(  errResp == true){
                    //this.router.navigate([ERR_PAGE]);          
                }
            }
                if(this.router.url=="/err"){
                    errResp=true;
                }else if(this.router.url=="/home" ){
                    errResp=false;

                }
                this.commonService.setHeaderVisbility(!errResp) 
               
                return throwError(error)
            })
        )
    }

     testRegex(value:any){
     value= this.decodeValue(value)
     
        let isMatch=false;
        const regex = new RegExp(PATTERN);
        isMatch =regex.test(value);
        if(!isMatch){
            const regexForHatch = new RegExp(PATTERNFORHATCH);
            isMatch =regexForHatch.test(value);
        }
        
        return isMatch;
    }

    decodeValue(value: string) {
        return decodeURIComponent(value);
      }


}