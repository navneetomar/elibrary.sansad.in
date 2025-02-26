import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, OnDestroy, Inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, firstValueFrom, forkJoin, of } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { environment } from '../../environments/environment';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { UltiService } from '../core/services/ulti.service';
import * as _ from 'lodash';
import { DomSanitizer } from '@angular/platform-browser';
import { HostWindowService } from '../shared/host-window.service';
import {DialogService} from 'primeng/dynamicdialog';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import { HomeSubPageComponent } from './home-sub-page/home-sub-page.component';
import { HostWindowState } from '../shared/search/host-window.reducer';
import { Store, select } from '@ngrx/store';
import { isAuthenticated } from '../core/auth/selectors';
import { hasValue } from '../shared/empty.util';
@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent implements OnInit, OnDestroy {
  site$: Observable<Site>;
  recentSubmissionspageSize: number;
  public results$: Observable<any>;
  public totalHomePage: any;
  public isAuthenticated: Observable<boolean>;
  helpfulImage: any[] = [];
  featuredContent: any[] = [];
  subcribe: Subscription;

  loadingCommunity$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingCollection$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  responsiveOptions: { breakpoint: string; numVisible: number; numScroll: number; }[];
  allCollectionList:any[] = [];
  collectionListGroup:any[] = [];
  selectedCollection:any;
  // totalCollectionGrouped:any;
  collectionListById: any[] = [];
  _collectionListById: any[] = [];

  communityListGroup:any[] = [];
  selectedCommunity:any;
  // totalcommunityGrouped:any;
  communityListById: any[] = [];
  _communityListById: any[] = [];

  itemsPerpage : any[] = [];
  collectionPerPage: any[] = [];
  collectionByComm: any[] = [];
  currentPageComm:number = 1;
  currentPage:number = 1;
  pageSize : number = 4;
  sizePagi: number = 5;
  isXsOrSm$: any;
  isLg$: Observable<boolean>;
  isMd$: Observable<boolean>;
  isXl$: Observable<boolean>;
  ref: DynamicDialogRef;
  @Output() isHomePage = true;
  constructor(
    private route: ActivatedRoute,
    private store: Store<HostWindowState>,
    private http: HttpClient,
    private ultiService: UltiService,
    public domSanitizer:DomSanitizer,
    protected windowService: HostWindowService,
    private router: Router,
    public dialogService: DialogService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    this.recentSubmissionspageSize =
      environment.homePage.recentSubmissions.pageSize;
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.isLg$ = this.windowService.isLg();
    this.isMd$ = this.windowService.isMd();
    this.isXl$ = this.windowService.isXl();
    


  }
 

  async ngOnInit(): Promise<void> {
    //this.getAllCommunitiesTop();
   
    this.site$ = this.route.data.pipe(map((data) => data.site as Site));
    this.helpfulImage = [
      {
        name: 'The President of India',
        imgUrl: 'assets/images/india_president.png',
        description: undefined,
        url: 'https://presidentofindia.nic.in',
        backgroundColor: '#A24724',
        textColor: '#fff'
      },
      {
        name: 'Lok Sabha',
        imgUrl: 'assets/images/LokSabha.png',
        description: 'House of the People',
        url: 'https://sansad.in/ls',
        backgroundColor: '#E2D8C9',
        textColor: '#000'
      },
      {
        name: 'Rajya Sabha',
        imgUrl: 'assets/images/RajyaSabha.png',
        description: 'council of states',
        url: 'https://sansad.in/rs',
        backgroundColor: '#77232E',
        textColor: '#fff'
      },
      {
        name: 'Parliament Library',
        imgUrl: 'assets/images/india_parliament.png',
        description: undefined,
        url: 'https://sansad.in/poi/knowledge-centre',
        backgroundColor: '#64AFFC',
        textColor: '#fff'
      },
      {
        name: 'Rajya Sabha Debates',
        imgUrl: 'assets/images/RajyaSabhaDebates.png',
        description: undefined,
        url: 'https://rsdebate.nic.in',
        backgroundColor: '#C72639',
        textColor: '#fff'
      },
      {
        name: 'Digital Library of India',
        imgUrl: 'assets/images/indiaDigitalLib.svg',
        description: undefined,
        url: 'https://ndl.iitkgp.ac.in',
        backgroundColor: '#009688',
        textColor: '#fff'
      },
    ];

    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  this.collectionListGroup = [];
  //this.resizeCollectionList();
 
  this.results$ = this.http
    .get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/browses/title/items?sort=dc.title,ASC&page=0&size=1`
    )
    .pipe(
      map((data) => {
        this.totalHomePage = data.page.totalElements;
      })
    );

    
  // this.subcribe = this.results$.subscribe((data) => data);
 
  //   this.loadFeaturedList();
  //   // this.loadAllCollection();
  //   this.allCollectionList = await this.getAllListCollection();
    
  //   await this.filterGroup();
  //   let find = this.collectionListGroup.findIndex(item => item.code == "Featured collections");
  //   if (find > -1){
  //     this.selectedCollection = this.collectionListGroup[find]?.code;
  //   } else {
  //     this.selectedCollection = this.collectionListGroup[0]?.code;
  //   }
  //   this.renderView(this.selectedCollection);
    
    
  }

  routeToWeb(url){
  if (typeof window !== 'undefined') {
    window.open(url);
  }
  }
  
  
  // renderView(id){
  //   if(id == 'all'){
  //     this._collectionListById = this.allCollectionList;
  //   }
  //   else{
  //     this._collectionListById = this.collectionListById.filter(item => item.parentName == id)
  //   }
  //   this.doPageChange(1);
  // }
  
  // getAllListCollection(): Promise<any[]>{
  //   return new Promise( (resolve, reject) => {
  //     this.ultiService.getAllCollection().subscribe(res => {
        
  //       if(res && res._embedded && res._embedded.searchResult && res._embedded.searchResult._embedded && res._embedded.searchResult._embedded.objects){
  //         let all = res._embedded.searchResult._embedded.objects;
  //         all.forEach(item => {
  //           this.getLogo(item._embedded.indexableObject._links['logo'].href).subscribe(logo => {
  //             if(logo){
  //               item['img'] = logo._links['content'].href;
                
  //             }else{
  //               item['img'] = 'assets/images/cover_book_enhira.png';
  //             }
  //           })
  //           item['name'] = item._embedded.indexableObject.name;
  //           item['path'] = `handle/${item._embedded.indexableObject.handle}`;
  //           item['desc'] = item._embedded.indexableObject.metadata['dc.description.abstract'] ? item._embedded.indexableObject.metadata['dc.description.abstract'][0]['value'] : '',
  //           item['parentName'] = item._embedded.indexableObject.metadata['dc.description.tableofcontents'] ? item._embedded.indexableObject.metadata['dc.description.tableofcontents'][0]['value'] : undefined
  //         })
  //         resolve(all);
  //       }
  //     })
  //   })
  // }
  // getCollectionsByCommunityId(id) {
  //   this.loadingCollection$.next(true);
  //   this.ultiService.getCollectionsByCommunityId(id).pipe(
  //     switchMap((data) => {
  //       if (data?._embedded?.collections && data?._embedded?.collections.length > 0) {
  //         const requests = data._embedded.collections.map(item => {
  //           return this.getLogo(item._links['logo'].href).pipe(
  //             map(logo => {
  //               if (logo?._links?.content?.href) {
  //                 item.img = logo._links.content.href;
  //               } else {
  //                 item.img = 'assets/images/cover_book_enhira.png';
  //               }
  //               return item;
  //             })
  //           );
  //         });
  //         return forkJoin(requests);
  //       } else {
  //         return of([]);
  //       }
  //     })
  //   ).subscribe(
  //     (collectionByComm: any[]) => {
        
  //       this.collectionByComm = collectionByComm;
  //       this.collectionPerPage = this.collectionByComm.slice(0, 4);
  //       this.loadingCollection$.next(false);
  //     },
  //     (err) => {
       
  //       this.loadingCollection$.next(false);
  //     }
  //   );
  // }
  
  // getAllCommunitiesTop() {
  //   this.loadingCommunity$.next(true);
  //   this.ultiService.getAllCommunitiesTop().subscribe(
  //     (data) => {
  //       if (data?._embedded?.communities && data._embedded.communities.length > 0) {
  //         this.communityListGroup = data._embedded.communities.map(item => ({
  //           id: item?.id,
  //           name: item?.name,
  //         }));
         
  //         const digitalComm = data._embedded.communities?.find((item)=> item?.name === 'Digital Library');

  //         if(digitalComm){
            
  //             this.selectedCommunity = digitalComm.id;
  //             this.getCollectionsByCommunityId(digitalComm.id);
           
  //         }else{
  //           if (data._embedded.communities[0]) {
  //             this.selectedCommunity = data._embedded.communities[0].id;
  //             this.getCollectionsByCommunityId(data._embedded.communities[0].id);
  //           }
  //         }
         
  //       }
  //       this.loadingCommunity$.next(false);
  //     },
  //     (err) => {
       
  //       this.loadingCommunity$.next(false);
  //     }
  //   );
  // }

  // filterGroup(){
  //   this.collectionListById = this.allCollectionList.filter(item => item.parentName != undefined)
  //   const hasGroup = this.collectionListById.filter(item => item._embedded.indexableObject.metadata['dc.description.tableofcontents'] && item._embedded.indexableObject.metadata['dc.description.tableofcontents'][0]['value'] !== '');
  //   const groupedBy = hasGroup.reduce((acc, coll) => {
  //     const by = coll._embedded.indexableObject.metadata['dc.description.tableofcontents'][0]['value'];
  //     if (!acc[by]) {
  //       acc[by] = [];
  //     }
  //     acc[by].push(coll);
  //     return acc;
  //   }, {});

  //   let list = Object.keys(groupedBy).map(key =>{
  //     const ele = {
  //       name: key,
  //       code: key
  //     }
  //     this.collectionListGroup.push(ele);
     
  //     return key;
  //   })

  // }

  // routeToCollection(path){
  //   this.router.navigateByUrl(`/handle/${path}`)
  // }
  // routeToCommunity(path){
  //   this.router.navigateByUrl(`/handle/${path}`)
  // }

  // doPageChange(event){
  //   this.currentPage = event
  //   this.itemsPerpage = this._collectionListById.slice((event-1)*this.pageSize, this.pageSize*event);
    
  // }
  // doPageChangeComm(event){
  //   this.currentPageComm = event
  //   this.collectionPerPage = this.collectionByComm.slice((event-1)*this.pageSize, this.pageSize*event);
  // }

  // loadFeaturedList(){
    
  //   this.featuredAPI().subscribe(res =>{
      
  //     if(res && res._embedded && res._embedded.searchResult && res._embedded.searchResult._embedded && res._embedded.searchResult._embedded.objects){
  //       const listFeatured = res._embedded.searchResult._embedded.objects;
  //       listFeatured.forEach(item =>{
         
  //         const ele = {
  //           name: item._embedded.indexableObject.name,
  //           path: `handle/${item._embedded.indexableObject.handle}`,
  //           // img: item._embedded.indexableObject._embedded.thumbnail ? imgUrl : 'assets/images/RajyaSabha.png',
  //           img: item._embedded.indexableObject._embedded.thumbnail ? item._embedded.indexableObject._embedded.thumbnail._links['content'].href : 'assets/images/cover_book_enhira.png',
  //         }
         
  //         this.featuredContent.push(ele);
  //       })
  //     }
  //   })
   
  // }

  // featuredAPI(){
  //   return this.http.get<any>(
  //     `${this.appConfig.rest.baseUrl}/api/discover/search/objects?query=dc.featured.content:true&dsoType=ITEM&embed=thumbnail`
  //   );
  // }

  // getLogo(link){
  //   return this.http.get<any>(
  //     link
  //   );
  // }

  // resizeCollectionList(){
  //   // let isXl;
  //   let isLg;
  //   let isMd;
  //   let isSm;
  //   // this.isLg$.subscribe(res => {
  //   //   isLg = res
  //   // })
  //   this.isLg$.subscribe(res => {
  //     isLg = res;
  //   })
  //   this.isMd$.subscribe(res => {
  //     isMd = res;
  //   })
  //   this.isXsOrSm$.subscribe(res => {
  //     isSm = res;
  //   })
  //  if(isLg){
  //   this.pageSize = 3;
  //  }
  //  if(isMd){
  //   this.pageSize = 2;
  //   this.sizePagi = 3
  //  }
  //  if(isSm){
  //   this.pageSize = 1;
  //   this.sizePagi = 1;
  //  }
  // }
  ngOnDestroy(): void {
    this.subcribe.unsubscribe();
   
  }
}
