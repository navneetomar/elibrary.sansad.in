import { ThemedComponent } from '../shared/theme-support/themed.component';
import { SidebarLeftComponent } from './sidebar-left.component';
import { Component } from '@angular/core';

@Component({
  selector: 'ds-themed-sidebar-left',
  styleUrls: [],
  templateUrl: '../shared/theme-support/themed.component.html',
})
export class ThemedSidebarLeftComponent extends ThemedComponent<SidebarLeftComponent> {

  protected getComponentName(): string {
    return 'SidebarLeftComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../themes/${themeName}/app/sidebar-left/sidebar-left.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./sidebar-left.component`);
  }

}
