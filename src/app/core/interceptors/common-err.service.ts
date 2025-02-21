import { Injectable } from "@angular/core";
import { BehaviorSubject,Observable } from "rxjs";
@Injectable({
    providedIn:'root'
})
export class CommonErrService{
    private headerVisibileSubject = new BehaviorSubject<any>(true);

    constructor(){}
    setHeaderVisbility(visible:any):void{
        this.headerVisibileSubject.next(visible)

    }

    getHeaderVisibilty():Observable<any>{
        return this.headerVisibileSubject.asObservable()
    }
}