import { Component, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent as BaseComponent } from '../../../../app/navbar/navbar.component';
import { slideMobileNav } from '../../../../app/shared/animations/slide';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { Observable } from 'rxjs';
import { LogOutAction } from 'src/app/core/auth/auth.actions';

/**
 * Component representing the public navbar
 */
@Component({
  selector: 'ds-navbar',
  styleUrls: ['./navbar.component.scss'],
  templateUrl: '../../../../app/navbar/navbar.component.html',
  animations: [slideMobileNav]
})
export class NavbarComponent extends BaseComponent {


}
