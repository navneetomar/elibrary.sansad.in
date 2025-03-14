import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';


@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.scss']
})
export class CountComponent implements OnInit {
  @Input() label: string = 'Total Items';
  @Input() scope: string | null = null; // If null, fetch total from all collections
  @Input() dsoType: string = 'ITEM'; // Default type is ITEM, can be overridden
  @Input() fontSize: string = '12px'; // If true, show title with count
  @Input() isLargeFont: boolean = false; // If true, show title with count
  textStyle: any = {};

  totalItems: number = 0;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  baseUrl: string = ''; // Dynamic Base URL

  constructor(private http: HttpClient, @Inject(APP_CONFIG) protected appConfig: AppConfig) { 
    
    this.textStyle = {
      'color': 'var(--neutral-dark-grey, #666)',
      'font-style': 'normal',
      'font-weight': '400',
      'line-height': '24px'
    };
  }

  ngOnInit() {
    this.baseUrl = this.appConfig.rest.baseUrl;
    //this.baseUrl = environment.rest.baseUrl;
    this.fetchTotalItems();
    if(this.isLargeFont) {
      this.fontSize = '16px';
    }
  }

  fetchTotalItems() {
    if (!this.baseUrl) return; // Base URL available hone tak wait karein

    let apiUrl = `${this.baseUrl}/api/discover/search/objects?dsoType=${this.dsoType}`;
    if (this.scope) {
      apiUrl += `&scope=${this.scope}`;
    }

    this.http.get<any>(apiUrl).subscribe(response => {
      if (response?._embedded?.searchResult?.page?.totalElements !== undefined) {
        this.totalItems = response._embedded.searchResult.page.totalElements;
      } else {
        this.totalItems = 0;
      }
      this.isLoading = false;
    }, error => {
      this.errorMessage = '';
      this.isLoading = false;
    });
  }
}
