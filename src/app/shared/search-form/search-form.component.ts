import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isNotEmpty } from '../empty.util';
import { SearchService } from '../../core/shared/search/search.service';
import { currentPath } from '../utils/route.utils';
import { PaginationService } from '../../core/pagination/pagination.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ScopeSelectorModalComponent } from './scope-selector-modal/scope-selector-modal.component';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { TopicListService } from 'src/app/topic-list-page/topic-list-service';
import { UltiService } from 'src/app/core/services/ulti.service';
import { HostWindowService } from '../host-window.service';
import { Location } from '@angular/common';
/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-form',
  styleUrls: ['./search-form.component.scss'],
  templateUrl: './search-form.component.html'
})

/**
 * Component that represents the search form
 */
export class SearchFormComponent implements OnInit {
  /**
   * The search query
   */
  @Input() query: string;

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch;
  /*check search collection page*/
  @Input() collectionId: string;
  /*check search community page*/
  @Input() communityId: string;
  /**
   * The currently selected scope object's UUID
   */
  @Input()
  scope = '';

  selectedScope: BehaviorSubject<DSpaceObject> = new BehaviorSubject<DSpaceObject>(undefined);

  @Input() currentUrl: string;

  /**
   * Whether or not the search button should be displayed large
   */
  @Input() large = false;

  /**
   * The brand color of the search button
   */
  @Input() brandColor = 'primary';

  /**
   * The placeholder of the search input
   */
  @Input() searchPlaceholder: string;

  /**
   * Defines whether or not to show the scope selector
   */
  @Input() showScopeSelector = false;

  @Input() hasAdvanced : boolean = false;

  @Input() hasChooseType : boolean = false;

  @Input() hasBackGround : boolean = false;


  inSearchPage:boolean = true;
  typeSearch: any[] = [];
  /**
   * Output the search data on submit
   */
  @Output() submitSearch = new EventEmitter<any>();

  filterAdvance: any [] = [];
  showAdvanceSearch: boolean = false;
  selectedType: any;
  selectedFilter: any;
  selectedTypeAll: any;
  filterList:any[]=[];
  arrayUrl: any[]=[];
  detectData: any[] = [];
  isCollectionDetails: boolean;
  isXsOrSm$: any;

  

  constructor(private router: Router,
              private searchService: SearchService,
              private paginationService: PaginationService,
              private searchConfig: SearchConfigurationService,
              private modalService: NgbModal,
              private dsoService: DSpaceObjectDataService,
              private cdr: ChangeDetectorRef,
              private ultiServices: UltiService,
              protected route: ActivatedRoute,
              protected windowService: HostWindowService,
              protected location: Location,


  ) {

    this.isXsOrSm$ = this.windowService.isXsOrSm();

    router.events.subscribe((val) => {
      if(val instanceof NavigationEnd)
          this.detectParam();
        });
  }

  /**
   * Retrieve the scope object from the URL so we can show its name
   */
  ngOnInit(): void {
   
    this.getQueryParam();
    if (isNotEmpty(this.scope)) {
      this.dsoService.findById(this.scope).pipe(getFirstSucceededRemoteDataPayload())
        .subscribe((scope: DSpaceObject) => this.selectedScope.next(scope));
    }


    this.ultiServices.getAllType().subscribe(res => {
    
      if(res && res._embedded && res._embedded.browses){
        this.typeSearch = [];
        
        res._embedded.browses.forEach(item => {
          let typeIn = {
            id: 'f.'+item.id,
            title: item.id
          }
          if(typeIn.id == 'f.dateissued'){
            typeIn.id = 'f.dateIssued'
          }
          this.typeSearch.push(typeIn)
        })

        this.detectParam();


        // console.log(this.typeSearch)

        this.cdr.detectChanges();
      }
    })

    
    this.filterList = [
      {
        title:"Contains",
        value:'contains'
      },
      {
        title:"Not Contains",
        value:'notcontains'
      },
      {
        title:"Equals",
        value:'equals'
      },
      {
        title:"Not Equals",
        value:'notequals'
      },
    ]

  }

  /**
   * Updates the search when the form is submitted
   * @param data Values submitted using the form
   */
  onSubmit(dataI: any) {
    if (this.collectionId){
      dataI = Object.assign(dataI, { scope: this.collectionId });
      this.updateSearch(dataI);
      this.submitSearch.emit(dataI);
    } else if (this.communityId){
      dataI = Object.assign(dataI, { scope: this.communityId });
      this.updateSearch(dataI);
      this.submitSearch.emit(dataI);
    } else {
  
      const path = this.location.path();
      if (path && path.includes('/edit/mapper')){

        if (isNotEmpty(this.scope)) {
          dataI = Object.assign(dataI, { scope: this.scope });
        }
        this.updateSearch(dataI);
        this.submitSearch.emit(dataI);
      } else if (path && path.includes('/admin/search')){
        if (isNotEmpty(this.scope)) {
          dataI = Object.assign(dataI, { scope: this.scope });
        }
        this.updateSearch(dataI);
        this.submitSearch.emit(dataI);
      } else {
        let data = {
              query: this.query,
            }
            if (isNotEmpty(this.scope)) {
              data = Object.assign(data, { scope: this.scope });
            }

            this.searchAdv();

            if (this.showAdvanceSearch && this.filterAdvance && this.filterAdvance.length > 0) {
              // this.updateSearch(data);
              setTimeout(() => {
                // this.searchAdv();
              }, 500);

            } else {
              // this.searchAdv();
            }
      }
    }
  }
  async searchAdv() {
    // console.log(this.filterAdvance)
    if (typeof window !== 'undefined') {

      const currentHref = window.location.href;
      // console.log(currentHref);

      let base = window.location.origin + '/search?';





      let newQueries = [];

      if(this.query && this.query !== '') {
        newQueries.push({code: 'query', value: this.query});

      }
      await this.route.queryParams
      .subscribe(currentParams => {
        // console.log(currentParams);
        const keyList = (Object.keys(currentParams));
        keyList.forEach(key => {

          // console.log(key, currentParams[key])
          if(key !== 'query' && currentParams[key] !== '' && this.typeSearch.findIndex(item => item.id == key) < 0) {
            if(key == 'spc.page'){
              newQueries.push({code: key, value: 1})
            }else{
              newQueries.push({code: key, value: currentParams[key]})
            }

          }
        })
      }
    );







        await this.filterAdvance.forEach((filter, index) => {
          if(filter.type !== 'all' && filter.filter !== 'pls' && filter.stringSearch !== '') {
            newQueries.push({code: filter.type, value: filter.stringSearch + ','+filter.filter})
          }
        })

        let finalLink = '';

        // console.log(newQueries)
        await newQueries.forEach(qr => {
          finalLink = finalLink+'&' + qr.code+ '=' + encodeURI(qr.value);
        })



        window.location.href = base+finalLink;


    }
    

    
  }

  searchWithAdv() {
    const queryParams = {
      query: this.query,
      advance: this.filterAdvance
    }
    this.router.navigate(this.getSearchLinkParts(), {
      queryParams: queryParams,
      // queryParamsHandling: 'merge',
    });
  }

  /**
   * Updates the search when the current scope has been changed
   * @param {string} scope The new scope
   */
  onScopeChange(scope: DSpaceObject) {
    this.updateSearch({ scope: scope ? scope.uuid : undefined },1);
  }

  /**
   * Updates the search URL
   * @param data Updated parameters
   */
  updateSearch(data: any, page?:number) {
    let queryParams = Object.assign({}, data);


    // const advQuery = {};

    // if(this.showAdvance && this.filterAdvance.length > 0) {
    //   console.log(this.filterAdvance);
    //   this.filterAdvance.forEach(filter => {
    //     if(filter.type !== 'all' && filter.filter !== 'pls' && filter.stringSearch !== '') {
    //       const type = filter.type 
    //       advQuery[type] = filter.stringSearch+ ',' + filter.filter;
    //     }
    //   })
    // }
    if(page){
      queryParams['spc.page'] = page;
    }
    this.router.navigate(this.getSearchLinkParts(), {

      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  /**
   * For usage of the isNotEmpty function in the template
   */
  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  /**
   * @returns {string} The base path to the search page, or the current page when inPlaceSearch is true
   */
  public getSearchLink(): string {
    if (this.inPlaceSearch) {
      return currentPath(this.router);
    }
    return this.searchService.getSearchLink();
  }

  /**
   * @returns {string[]} The base path to the search page, or the current page when inPlaceSearch is true, split in separate pieces
   */
  public getSearchLinkParts(): string[] {
    if (this.inPlaceSearch) {
      return [];
    }
    return this.getSearchLink().split('/');
  }

  /**
   * Open the scope modal so the user can select DSO as scope
   */
  openScopeModal() {
    const ref = this.modalService.open(ScopeSelectorModalComponent);
    ref.componentInstance.scopeChange.pipe(take(1)).subscribe((scope: DSpaceObject) => {
      this.selectedScope.next(scope);
      this.onScopeChange(scope);
    });
  }
  showAdvance(){
    if(this.filterAdvance.length > 0){
      this.showAdvanceSearch = false;
      this.filterAdvance = [];
    }else{
      this.addFilter();
      this.showAdvanceSearch = true;
    }
    
  }
  addFilter(){
    let filter = {
      type: 'all',
      filter:'pls',
      stringSearch:''
    }
    this.filterAdvance.push(filter)
    // console.log(this.filterAdvance)


    // if(this.showAdvance && this.filterAdvance.length > 1) {
    //   const lastFilter = this.filterAdvance[this.filterAdvance.length-2];
    //   console.log(lastFilter);


    //   let data = {};
    //   data[lastFilter.type] = lastFilter.stringSearch+','+lastFilter.filter;

    //   this.updateSearch(data);
    //   this.submitSearch.emit(data);
    // }
    this.cdr.detectChanges();
  }

  resetFilter(){
    this.filterAdvance = [];
    this.addFilter();
  }
  deleteFilter(item, index){
    if(this.filterAdvance.length == 1){
      this.showAdvanceSearch = false;
    }
    this.filterAdvance.splice(index,1);

    // setTimeout(() => {
    //   this.searchAdv();
    // }, 100);
    this.cdr.detectChanges();
  }


  detectParam() {
    this.filterAdvance = [];




    if (typeof window !== 'undefined') {
      // console.log(window)
      let currentOrigin = window.location.origin +'/search?'
      let currentUrl = window.location.href;
      
      
      // console.log(currentOrigin)
      // console.log(currentUrl)
      if(currentUrl.includes('query=')){
        currentOrigin = currentOrigin + 'query=' + this.query;
      }
      let url = currentUrl.slice(currentOrigin.length);
      // console.log(url)
      let sliceUrls = url.split('&');

      sliceUrls = [...new Set(sliceUrls)];

      // console.log(sliceUrls);


      // console.log(this.typeSearch);

      sliceUrls.forEach((item,index) =>{

        let findEqual = item.indexOf("=");
        let findSemi = item.lastIndexOf(",");
        if(item.trim() !== '' && findEqual >= 0 && findSemi >= 0 ){

          const type = {
            type: item.slice(0,findEqual),
            filter:  item.slice(findSemi+1, item.length),
            stringSearch: decodeURIComponent(item.slice(findEqual+1, findSemi)),
          }

          if(this.typeSearch.find(item => item.id == type.type) && 
            type.type.trim().length > 0 &&
            type.filter.trim().length > 0 &&
            type.stringSearch.trim().length > 0
            ) {
            this.filterAdvance.push(type);
          }
          


          this.cdr.detectChanges();




          // console.log(type)
         
        }
      })
      if(this.filterAdvance.length > 0){
        this.showAdvanceSearch = true
      }
    }
   
  }


  getQueryParam() {
    this.route.queryParams
      .subscribe(params => {
        // console.log(params); // { orderby: "price" }

        if(params && params.scope && params.scope !== '') {
          this.isCollectionDetails = true;
        }
      }
    );
  }



}

  




