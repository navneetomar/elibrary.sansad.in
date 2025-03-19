import { ChangeDetectorRef, Component, HostListener, Inject, Injector } from '@angular/core';
import { slideMobileNav } from '../shared/animations/slide';
import { MenuComponent } from '../shared/menu/menu.component';
import { MenuService } from '../shared/menu/menu.service';
import { TextMenuItemModel } from '../shared/menu/menu-item/models/text.model';
import { LinkMenuItemModel } from '../shared/menu/menu-item/models/link.model';
import { HostWindowService } from '../shared/host-window.service';
import { BrowseService } from '../core/browse/browse.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { PaginatedList } from '../core/data/paginated-list.model';
import { BrowseDefinition } from '../core/shared/browse-definition.model';
import { RemoteData } from '../core/data/remote-data';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { MenuID } from '../shared/menu/menu-id.model';
import { MenuItemType } from '../shared/menu/menu-item-type.model';
import { ThemeService } from '../shared/theme-support/theme.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../core/auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { Observable } from 'rxjs';
import { NavbarService } from './navbar.service';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';



/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: './navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends MenuComponent {

  isSticky: boolean = false; // Default state
  isMobile: boolean = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = window.innerWidth < 768;
  }

  /**
   * The menu ID of the Navbar is PUBLIC
   * @type {MenuID.PUBLIC}
   */
  totalCount: number = 0;  // This will remain constant, no changes to it
  fontSize: number = 12;
  menuID = MenuID.PUBLIC;
  DSpaceObjectType = DSpaceObjectType;

  increase() {
    this.fontSize += 2;  }

  decrease() {
    this.fontSize -= 2;  }
  original()
{
  this.fontSize = 20;
}
home = {
    title: 'Home',
    order:87,
    path: '/home',
  }
   

books = {
    title: 'Books',
    id: 1,
    order:88,
    path: '/collections/c5ba6e19-880d-4fae-accc-7c8851ede5d6',
  }
  reports = {
    title: 'Reports',
    id: -1,
    order:89,
    path: '/collections/5923c438-7e2a-4351-9ca9-2d188621ff08',
  }
  papers_table = {
    title: 'Papers Laid On The Table',
    id: -2,
    order:90,
    path: '/collections/6c17e597-0efc-4518-8076-df80b21a73d3',
  }
  periodicals = {
    title: 'Periodicals',
    id: 2,
    order:91,
    path: '/collections/a3332ba9-a2d7-4830-97ca-428bb656287e',
  }
  act_bills = {
    title: "Act & Bills",
    id: 3,
    order: 92,
    children:[
      {
        title:"Acts",
        path:"/collections/43990891-603c-493f-9ea3-abf8c0fc76c4"
      },
      {
        title:"Bills",
        path:"/collections/865c088e-f3e9-49ae-8c80-755e5f487a47"
      },
     
    
     
      {
        title:"Joint Select Committee Report on Bills",
        path:"/collections/50a63200-7e39-404a-b89e-8f561ed4caad"
      },
     
    ]
  }
  e_parlib = {
    title: "E-Parlib",
    id: 4,
    order: 93,
    path: "/communities/ca1f325a-61ab-4d3c-857d-f48a9b78b1a2"
  }
dash = {
    title: "Dashboard",
    id: 4,
    order: 95,
    path: "https://lookerstudio.google.com/u/0/reporting/1kQP3-hM56_0Jh-xADwZzh193IvIab5o1/page/1M"
  }

  menuExploreBy = {
    title: "Explore By",
    id: 5,
    order: 94,
    children:[
      {
        title:"Communities",
        path:"community-list"
      },
     
      {
        title:"Authors",
        path:"browse/author"
      },
     
      {
        title:"Title",
        path:"browse/title"
      },
     
      // {
      //   title:"Keywords",
      //   path:"browse/subject",
      // },
      {
        title:"Date",
        path:"browse/dateissued",
      },
    ]
  };


  date:any;
  hour: any;
  menu: any[] = [];
  query:string;
  dso: DSpaceObject;
  isCollapse: boolean;
  collectionsId: any[] = ['bb0a0626-da29-4d7d-891a-2fbf80685248','e4520942-5154-4981-adab-9df3f323f644','5e22796d-559b-4231-8b44-97940d557ec2','ee4343bd-84f1-48dd-8737-6d5964d225ed'];
  communitiesId: any[] = ['343f4f15-13b6-451f-836e-c5d1c8bff5a2'];
  public isAuthenticated: Observable<boolean>;

  community = {
    id: 'papers-laid-community'  // Replace with actual community ID for Papers Laid
  };

  constructor(protected menuService: MenuService,
    protected injector: Injector,
              public windowService: HostWindowService,
              public browseService: BrowseService,
              public authorizationService: AuthorizationDataService,
              public route: ActivatedRoute,
              protected themeService: ThemeService,
              protected location: Location,
              public cdr: ChangeDetectorRef,
              public router: Router,
              public http: HttpClient,
              public authService: AuthService,
              public store: Store<AppState>,
              public navbarService: NavbarService,
              @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    super(menuService, injector, authorizationService, route, themeService,location);
  }

  ngOnInit(): void {
   
    this.createMenu();
    super.ngOnInit();

    this.convertDate();
    this.isAuthenticated = this.authService.isAuthenticated();
    this.menu = [];
    if (typeof window !== 'undefined') {
      setInterval(() =>{
        this.convertHour();
        // this.cdr.detectChanges();
        window.dispatchEvent(new Event('resize')); 
      }, 1000);
    }
    this.menu.push(this.home);
    this.menu.push(this.books);
    this.menu.push(this.reports);
    this.menu.push(this.papers_table);
    this.menu.push(this.periodicals);
    this.menu.push(this.act_bills);
    this.menu.push(this.e_parlib);
    this.menu.push(this.menuExploreBy);

  }

  /**
   * Initialize all menu sections and items for this menu
   */
   
  createMenu() {
    const menuList: any[] = [
      /* Communities & Collections tree */
      {
        id: `browse_global_communities_and_collections`,
        active: false,
        visible: false,
        index: 0,
        model: {
          type: MenuItemType.LINK,
          text: `menu.section.browse_global_communities_and_collections`,
          link: `/community-list`
        } as LinkMenuItemModel
      }
    ];
    // Read the different Browse-By types from config and add them to the browse menu
    this.browseService.getBrowseDefinitions()
      .pipe(getFirstCompletedRemoteData<PaginatedList<BrowseDefinition>>())
      .subscribe((browseDefListRD: RemoteData<PaginatedList<BrowseDefinition>>) => {
        if (browseDefListRD.hasSucceeded) {
          browseDefListRD.payload.page.forEach((browseDef: BrowseDefinition) => {
            menuList.push({
              id: `browse_global_by_${browseDef.id}`,
              parentID: 'browse_global',
              active: false,
              visible: false,
              model: {
                type: MenuItemType.LINK,
                text: `menu.section.browse_global_by_${browseDef.id}`,
                link: `/browse/${browseDef.id}`
              } as LinkMenuItemModel
            });
          });
          menuList.push(
            /* Browse */
            {
              id: 'browse_global',
              active: false,
              visible: false,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: 'menu.section.browse_global'
              } as TextMenuItemModel,
            }
          );
        }
        menuList.forEach((menuSection) => this.menuService.addSection(this.menuID, Object.assign(menuSection, {
          shouldPersistOnRouteChange: true
        })));
      });

  }

  convertDate(){
    this.date = new Date().toDateString();
  }
  convertHour(){
    this.hour = new Date().toLocaleTimeString();
    
  }
  removeExpanded(path){
    this.menu.map(item => {
      item.isExpanded = undefined;
    });
  }
  search(){
    
    if(this.query){
      this.router.navigate(['search'],{queryParams:{query: this.query}})
    }
  }
  loadListCommunity(position){

    this.navbarService.getCommunities().subscribe(data =>{
      
      let listCommmunity = data['_embedded']['searchResult']['_embedded']['objects'];
     
      if(listCommmunity){
        listCommmunity.forEach((community: DSpaceObject) =>{
          
          if(community['_embedded'] && community['_embedded'].indexableObject && this.communitiesId.includes(community['_embedded'].indexableObject.uuid)){
            const linkCollection = community['_embedded'].indexableObject._links.collections.href;
           
            let item = community['_embedded'].indexableObject
            let find = this.communitiesId.findIndex(id => id == item.uuid)
            let $menu = {
              title: item.name,
              path: item.handle,
              id: item.uuid,
              order: position,
              children:[]
            }
            this.http.get(linkCollection).subscribe(res =>{
              
              if(res && res['_embedded'] && res['_embedded']['collections'] && res['_embedded']['collections']){
                res['_embedded']['collections'].forEach(collection => {
                  let child = {
                    title: collection.name,
                    path: `handle/${collection.handle}`
                  }
                  $menu.children.push(child);
                })
                
                this.menu.push($menu);
                this.menu.sort(this.sortMenuByOrder)
              }
            })
          }
        })
      }
 
    })

  }
  
  showNavCollapse(forceClose = false) {
    this.isCollapse = forceClose ? false : !this.isCollapse;
  }
  
  @HostListener("window:scroll", [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (currentScroll > 100) { // 100px scroll hone par sticky ho jayega
      this.isSticky = true;
    } else {
      this.isSticky = false;
    }
  }

  setMenu(item) {
    this.menu.forEach(sub => {
      if(sub.id !== item.id){
        sub.isExpanded = undefined;
      }
    })
    item.isExpanded = !item.isExpanded;

  }
  sortMenuByOrder(a,b){
    return a.order - b.order;
  }
  
}
