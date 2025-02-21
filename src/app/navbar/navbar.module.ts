import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from '../core/core.module';
import { NavbarEffects } from './navbar.effects';
import { NavbarSectionComponent } from './navbar-section/navbar-section.component';
import { ExpandableNavbarSectionComponent } from './expandable-navbar-section/expandable-navbar-section.component';
import { ThemedExpandableNavbarSectionComponent } from './expandable-navbar-section/themed-expandable-navbar-section.component';
import { NavbarComponent } from './navbar.component';
import { MenuModule } from '../shared/menu/menu.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ThemedNavbarComponent } from './themed-navbar.component';
import { NavbarService } from './navbar.service';
import { TopbarComponent } from '../components/topbar/topbar.component';
import { CurrentDateComponent } from '../components/current-date/current-date.component';
import { CurrentTimeComponent } from '../components/current-time/current-time.component';
import { FontResizerComponent } from '../components/font-resizer/font-resizer.component';
import { ColourSwitcherComponent } from '../components/colour-switcher/colour-switcher.component';





const effects = [
  NavbarEffects
];

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  NavbarSectionComponent,
  ThemedExpandableNavbarSectionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MenuModule,
    FormsModule,
    TranslateModule,
    
    EffectsModule.forFeature(effects),
    CoreModule.forRoot()
  ],
  declarations: [
    NavbarComponent,
    ThemedNavbarComponent,
    NavbarSectionComponent,
    TopbarComponent,
    CurrentDateComponent,
    CurrentTimeComponent,
    FontResizerComponent,
    ColourSwitcherComponent,
    ExpandableNavbarSectionComponent,
    ThemedExpandableNavbarSectionComponent,
  ],
  providers: [
    NavbarService
  ],
  exports: [
    ThemedNavbarComponent,
    NavbarSectionComponent,
    TopbarComponent,
    CurrentDateComponent,
    CurrentTimeComponent,
    FontResizerComponent,
    ColourSwitcherComponent,
    ThemedExpandableNavbarSectionComponent,
    
  ]
})

/**
 * This module handles all components and pipes that are necessary for the horizontal navigation bar
 */
export class NavbarModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: NavbarModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }

}
