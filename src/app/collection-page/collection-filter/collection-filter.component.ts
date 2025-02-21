import { ChangeDetectionStrategy, Component, Input, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import {BehaviorSubject, Subscription, throwError, catchError, map, Observable} from 'rxjs';
import { CollectionFilterService } from './collection-filter.service';
import {  SearchFilterService } from 'src/app/core/shared/search/search-filter.service';
import { Router } from '@angular/router';


@Component({
  selector: 'ds-collection-filter',
  styleUrls: ['./collection-filter.component.scss'],
  templateUrl: './collection-filter.component.html',
})
export class CollectionFilterComponent implements OnInit , OnDestroy{
  @Input() scopeID: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  subcribe: Subscription;
  filterOptions = [];
  filterOptionsBackup = [];
  page = 0;
  formDataSearchYear = {
    MinYear: '',
    MaxYear: '',
  };
  formDataSearchText = {
    author: '',
    subject: '',
    entityType: '',
    itemtype: '',
    publisher: ''
  };
  max = new Date().getUTCFullYear();
  min = 1950;
  range =  [];
  keyboardControl: boolean;
  panelId = '';
  collapsed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(private collectionFilterService: CollectionFilterService,
    private filterService: SearchFilterService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
    ){ }

  ngOnInit(): void {
  
    this.loadData();
  }
  loadData(){
    this.isLoading$.next(true);
    this.subcribe = this.collectionFilterService.getFacets(this.scopeID?.id).pipe(map((item)=>item),
    catchError((err)=>{
        this.isLoading$.next(false);
        return throwError(err);
    })).subscribe((data)=>{
       
        if (data && data._embedded && data._embedded.facets.length > 0){
            data._embedded.facets.forEach(item=>{
                this.collectionFilterService.getFacetByType(this.scopeID?.id,0,item.name).pipe(map((facets)=>facets),catchError((err)=>{
                    this.isLoading$.next(false);
                    return throwError(err);
                })).subscribe((dataItem)=>{
                    
                   if (dataItem._embedded.values && dataItem._embedded.values.length > 0){
                    this.filterOptions.push({
                        type: dataItem.name,
                        values: dataItem._embedded.values,
                        showMore: dataItem._links.next ? true : false,
                        collapse: false,
                    });
                   }

                    this.isLoading$.next(false);
                });
            });
        }
        this.range.push(this.min);
        this.range.push(this.max);
        this.isLoading$.next(false);
    });
  }
  toggle(type) {
    this.collapsed$.next(true);
  }

  checkTypeHaveSearch(type){
    let types = ['author','subject','entityType','itemtype','publisher'];
    if (types.includes(type)){
        return true;
    }
    return false;
  }
  showMore(type){
    this.isLoading$.next(true);
    this.page++;
    this.collectionFilterService.getFacetByType(this.scopeID?.id,this.page,type).pipe(map((facets)=>facets),catchError((err)=>{
        this.isLoading$.next(false);
        return throwError(err);
    })).subscribe((dataItem)=>{
        // console.log('dataItem',dataItem);
       if (dataItem._embedded.values && dataItem._embedded.values.length > 0){
        this.filterOptions.forEach((item)=>{
            if (item.type === type){
                this.filterOptionsBackup = [...item.values];
                item.values = [...item.values, ...dataItem._embedded.values];
                this.filterOptionsBackup = [...item.values];
                item.collapse = true;
                if (dataItem._links && !dataItem._links.next){
                    item.showMore = false;
                };
            }
        });
       }

        this.isLoading$.next(false);
    });
    this.panelId = type;
  }
  showLess(type){
    this.page = 0;
    this.isLoading$.next(true);
    this.collectionFilterService.getFacetByType(this.scopeID?.id,this.page,type).pipe(map((facets)=>facets),catchError((err)=>{
        this.isLoading$.next(false);
        return throwError(err);
    })).subscribe((dataItem)=>{
       if (dataItem._embedded.values && dataItem._embedded.values.length > 0){
        this.filterOptions.forEach((item)=>{
            if (item.type === type){
                item.values = dataItem._embedded.values;
                this.filterOptionsBackup = [...item.values];
                item.collapse = false;
                if (dataItem._links && !dataItem._links.next){
                    item.showMore = false;
                } else {
                    item.showMore = true;
                }
            }
        });
       }
        this.isLoading$.next(false);
    });
    this.panelId = type;
  }
  redirectSearch(value, type) {
   let queryParams;
   if (type !== 'dateIssued'){
    queryParams = {
        scope: this.scopeID?.id,
        [`f.${type}`]: `${value},equals`,
        'spc.page': 1
      };
   } else {
     let valueSplit = value.toString().split(' - ');
     let min = valueSplit[0];
     let max = valueSplit[1];
     queryParams = {
        scope: this.scopeID?.id,
        'spc.page': 1
      };
     if (min){
      queryParams[`f.${type}.min`] = `${min}`;
     }
     if (max){
      queryParams[`f.${type}.max`] = `${max}`;
     }
   }
    this.router.navigate(['/search'], {
      queryParams: queryParams
    });
  }
  onSubmit() {
    let min = this.formDataSearchYear.MinYear;
    let max = this.formDataSearchYear.MaxYear;
   let queryParams = {
       scope: this.scopeID?.id,
       [`f.dateIssued.min`]: `${min}`,
       [`f.dateIssued.max`]: `${max}`,
       'spc.page': 1
     };
     this.router.navigate(['/search'], {
        queryParams: queryParams
      });
  }
  onSubmitSearchText(type){
    let queryParams = {
        scope: this.scopeID?.id,
        [`f.${type}`]: `${this.formDataSearchText[type]},query`,
        'spc.page': 1
      };
      this.router.navigate(['/search'], {
        queryParams: queryParams
      });
  }
  startKeyboardControl(): void {
    this.keyboardControl = true;
  }

  stopKeyboardControl(): void {
    this.keyboardControl = false;
  }
  onSubmitRange() {
    if (this.keyboardControl) {
      return;  // don't submit if a key is being held down
    }
    // &f.dateIssued.min=1973
    const newMin = this.range[0] !== this.min ? [this.range[0]] : null;
    const newMax = this.range[1] !== this.max ? [this.range[1]] : null;
    if (newMin !== null && newMax === null){
        let queryParams = {
            scope: this.scopeID?.id,
            [`f.dateIssued.min`]: `${newMin}`,
            'spc.page': 1
          };
          this.router.navigate(['/search'], {
             queryParams: queryParams
           });
    }
    if (newMin === null && newMax !== null){
        let queryParams = {
            scope: this.scopeID?.id,
            [`f.dateIssued.max`]: `${newMax}`,
            'spc.page': 1
          };
          this.router.navigate(['/search'], {
             queryParams: queryParams
         });
    }
  }

  ngOnDestroy(): void {
    if (this.subcribe){
        this.subcribe.unsubscribe();
    }
    this.panelId = '';
  }
}
