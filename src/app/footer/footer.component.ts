import { Component, Inject, Optional } from '@angular/core';
import { hasValue } from '../shared/empty.util';
import { KlaroService } from '../shared/cookies/klaro.service';
import { environment } from '../../environments/environment';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';
import { DSpaceObject } from '../core/shared/dspace-object.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ds-footer',
  styleUrls: ['footer.component.scss'],
  templateUrl: 'footer.component.html'
})
export class FooterComponent {
  dateObj: number = Date.now();
  menu: any[]=[];
  contactList: any;
  /**
   * A boolean representing if to show or not the top footer container
   */
  showTopFooter = false;
  showPrivacyPolicy = environment.info.enablePrivacyStatement;
  showEndUserAgreement = environment.info.enableEndUserAgreement;
  listIdMenu: any[] = [];

  constructor(
    @Optional() private cookies: KlaroService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,

    public http: HttpClient,
  
  ) {
  }

  async ngOnInit(){
    this.listIdMenu = [
      'c9a42585-4cca-4461-bec2-8417c75cb5ee','b533077b-64f6-4c40-b094-de5d0e1f4bd5','80eeab8b-ca81-4e4b-a4db-82924f56720b','9d1a46c3-b4af-4882-8a9f-50b44e567768'
    ]
    // this.menu = [
    //   {
    //     title: "Lok Sabha Debates",
    //     children:[
    //       {
    //         title:"Text of Debates",
    //         path:"#"
    //       },
    //       {
    //         title:"Text of Debates (Hindi)",
    //         path:"#"
    //       },
    //       {
    //         title:"Debate by Titles / Members",
    //         path:"#"
    //       }
    //     ]
    //   },
    //   {
    //     title: "Parliamentary Documents",
    //     children:[
    //       {
    //         title:"Presidential Addresses",
    //         path:"#"
    //       },
    //       {
    //         title:"Budget Speeches",
    //         path:"#"
    //       },
    //       {
    //         title:"Parliamentary Committee Reports",
    //         path:"#"
    //       },
    //       {
    //         title:"Resume of Work Done by Lok Sabha",
    //         path:"#"
    //       },
    //       {
    //         title:"Lok Sabha Bulletin I",
    //         path:"#"
    //       },
    //       {
    //         title:"Lok Sabha Bulletin II",
    //         path:"#"
    //       },
    //     ]
    //   },
     
    //   {
    //     title: "Historical Debates",
    //     children:[
    //       {
    //         title:"Provisional Parliament Debates",
    //         path:"#"
    //       },
    //       {
    //         title:"Constituent Assembly-Draft Making Debates",
    //         path:"#"
    //       },
    //       {
    //         title:"Constituent Assembly-Legislative Debates",
    //         path:"#"
    //       },
    //       {
    //         title:"Council of States Debates",
    //         path:"#"
    //       },
    //       {
    //         title:"Legislative Assembly Debates",
    //         path:"#"
    //       },
    //       {
    //         title:"Indian Legislative Council Debates",
    //         path:"#"
    //       },
    //     ]
    //   },
    //   {
    //     title: "Publications",
    //     children:[
    //       {
    //         title:"Books",
    //         path:"#"
    //       },
    //       {
    //         title:"Information Bulletins",
    //         path:"#"
    //       },
    //       {
    //         title:"Periodicals",
    //         path:"#"
    //       }
    //     ]
    //   }
    // ];

    // this.contactList = [
    //   {
    //     title: "About Us",
    //     path: "#"
    //   },
    //   {
    //     title: "Dashboard",
    //     path: "#"
    //   },
    //   {
    //     title: "FAQs",
    //     path: "#"
    //   },
    //   {
    //     title: "User Guide",
    //     path: "#"
    //   },
    //   {
    //     title: "Sitemap",
    //     path: "#"
    //   },
    //   {
    //     title: "Contact Us",
    //     path: "#"
    //   },
    //   {
    //     title: "Disclaimer",
    //     path: "#"
    //   },
    //   {
    //     title: "Feedback",
    //     path: "#"
    //   },
    //   {
    //     title: "Terms & Conditions",
    //     path: "#"
    //   },
    //   {
    //     title: "Hyperlinking Policy",
    //     path: "#"
    //   },
    //   {
    //     title: "Accessibility Statement",
    //     path: "#"
    //   },
    //   {
    //     title: "Copyright Policy",
    //     path: "#"
    //   }
    // ]
    this.loadListCommunity();
   
  }
  showCookieSettings() {
    if (hasValue(this.cookies)) {
      this.cookies.showSettings();
    }
    return false;
  }

  loadListCommunity(){
    this.http.get(
      `${this.appConfig.rest.baseUrl}/api/discover/search/objects?size=9999&dsoType=COMMUNITY`
    ).subscribe(data =>{
      
      let listCommmunity = data['_embedded']['searchResult']['_embedded']['objects'];
      
      if(listCommmunity){

        listCommmunity.forEach((community: DSpaceObject) =>{
          
          if(community['_embedded'] && community['_embedded'].indexableObject && this.listIdMenu.includes(community['_embedded'].indexableObject.uuid)){
            const linkCollection = community['_embedded'].indexableObject._links.collections.href;
           
            let item = community['_embedded'].indexableObject
            let find = this.listIdMenu.findIndex(id => id == item.uuid)
            let $menu = {
              title: item.name,
              path: item.handle,
              id: item.uuid,
              order: find,
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

  sortMenuByOrder(a,b){
      return a.order - b.order;
  }
}
