import { map, startWith } from 'rxjs/operators';
import { Component, Inject, Input,OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest as combineLatestObservable, Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { MetadataService } from '../core/metadata/metadata.service';
import { HostWindowState } from '../shared/search/host-window.reducer';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../core/services/window.service';
import { AuthService } from '../core/auth/auth.service';
import { CSSVariableService } from '../shared/sass-helper/css-variable.service';
import { MenuService } from '../shared/menu/menu.service';
import { HostWindowService } from '../shared/host-window.service';
import { ThemeConfig } from '../../config/theme.model';
import { Angulartics2DSpace } from '../statistics/angulartics/dspace-provider';
import { environment } from '../../environments/environment';
import { slideSidebarPadding } from '../shared/animations/slide';
import { MenuID } from '../shared/menu/menu-id.model';
import { getPageInternalServerErrorRoute } from '../app-routing-paths';
import { isAuthenticated } from '../core/auth/selectors';
import { Location } from '@angular/common';

@Component({
  selector: 'ds-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  animations: [slideSidebarPadding],
})
export class RootComponent implements OnInit, OnDestroy{
  isShowHomePage = false;

  sidebarVisible: Observable<boolean>;
  slideSidebarOver: Observable<boolean>;
  collapsedSidebarWidth: Observable<string>;
  totalSidebarWidth: Observable<string>;
  theme: Observable<ThemeConfig> = of({} as any);
  notificationOptions;
  models;

  public isAuthenticated: Observable<boolean>;

  /**
   * Whether or not to show a full screen loader
   */
  @Input() shouldShowFullscreenLoader: boolean;

  /**
   * Whether or not to show a loader across the router outlet
   */
  @Input() shouldShowRouteLoader: boolean;

  constructor(
    @Inject(NativeWindowService) private _window: NativeWindowRef,
    private translate: TranslateService,
    private store: Store<HostWindowState>,
    private metadata: MetadataService,
    private angulartics2DSpace: Angulartics2DSpace,
    private authService: AuthService,
    private router: Router,
    private cssService: CSSVariableService,
    private menuService: MenuService,
    private windowService: HostWindowService,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {
    this.notificationOptions = environment.notifications;
  }
  
 
  


  ngOnInit() {
    this.sidebarVisible = this.menuService.isMenuVisible(MenuID.ADMIN);

    this.collapsedSidebarWidth = this.cssService.getVariable(
      '--ds-collapsed-sidebar-width'
    );
    this.totalSidebarWidth = this.cssService.getVariable(
      '--ds-total-sidebar-width'
    );

    const sidebarCollapsed = this.menuService.isMenuCollapsed(MenuID.ADMIN);
    this.slideSidebarOver = combineLatestObservable([
      sidebarCollapsed,
      this.windowService.isXsOrSm(),
    ]).pipe(
      map(([collapsed, mobile]) => collapsed || mobile),
      startWith(true)
    );

    if (this.router.url === getPageInternalServerErrorRoute()) {
      this.shouldShowRouteLoader = false;
    }
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));
    // if (typeof window !== undefined && typeof localStorage !== 'undefined'){
    //   localStorage && localStorage.getItem('isShowFirstPage') === '1' ? this.isShowHomePage = true : this.isShowHomePage = false;
    // }
    
  }
  // showHomePageRegister(){
  //   this.isShowHomePage = true;
  //   this.router.navigate(['/login']);
  // }
  // showHomePageGuess(){
  //   this.isShowHomePage = true;
  //   // this.router.navigate(['/login']);
  // }
  handleValue(value: boolean){
    this.isShowHomePage = value;
    localStorage.setItem('isShowFirstPage','1');
  }
  ngOnDestroy(): void {
    if (typeof window !== undefined && typeof localStorage !== 'undefined'){
      if (localStorage){
        localStorage.removeItem('isShowFirstPage');
      }
    }
  }
}
