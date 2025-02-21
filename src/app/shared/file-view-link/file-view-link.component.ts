import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../core/shared/bitstream.model';
import {
  getBitstreamViewRoute,
  getBitstreamRequestACopyRoute,
} from '../../app-routing-paths';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { hasValue, isNotEmpty } from '../empty.util';
import { map } from 'rxjs/operators';
import {
  of as observableOf,
  combineLatest as observableCombineLatest,
  Observable,
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { FileService } from 'src/app/core/shared/file.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'ds-file-view-link',
  templateUrl: './file-view-link.component.html',
  styleUrls: ['./file-view-link.component.scss'],
})
/**
 * Component displaying a download link
 * When the user is authenticated, a short-lived token retrieved from the REST API is added to the download link,
 * ensuring the user is authorized to download the file.
 */
export class FileViewLinkComponent implements OnInit {
  /**
   * Optional bitstream instead of href and file name
   */
  @Input() bitstream: Bitstream;

  @Input() item: Item;

  /**
   * Additional css classes to apply to link
   */
  @Input() cssClasses = '';

  /**
   * A boolean representing if link is shown in same tab or in a new one.
   */
  @Input() isBlank = false;

  @Input() enableRequestACopy = true;

  bitstreamPath$: Observable<{
    routerLink: string;
    queryParams: any;
  }>;

  canView$: Observable<boolean>;
  loading$ = new BehaviorSubject<boolean>(false);
  isShow = true;
  retriedWithToken = false;
  subscribe: Subscription;
  isAuthorized$ = false;
  linkViewOnline = null;

  constructor(
    private authService: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected fileService: FileService
  ) {}

  ngOnInit() {
    if (this.enableRequestACopy) {
      this.canView$ = this.authorizationService.isAuthorized(
        FeatureID.CanView,
        isNotEmpty(this.bitstream) ? this.bitstream.self : undefined
      );
      const canRequestACopy$ = this.authorizationService.isAuthorized(
        FeatureID.CanRequestACopy,
        isNotEmpty(this.bitstream) ? this.bitstream.self : undefined
      );
      this.bitstreamPath$ = observableCombineLatest([
        this.canView$,
        canRequestACopy$,
      ]).pipe(
        map(([canView, canRequestACopy]) =>
          this.getBitstreamPath(canView, canRequestACopy)
        )
      );
    } else {
      this.bitstreamPath$ = observableOf(this.getBitstreamViewPath());
      this.canView$ = observableOf(true);
    }
    this.isShow = this.getExtension(this.bitstream?.name);
  }

  getBitstreamPath(canView: boolean, canRequestACopy: boolean) {
    if (!canView && canRequestACopy && hasValue(this.item)) {
      return getBitstreamRequestACopyRoute(this.item, this.bitstream);
    }
    return this.getBitstreamViewPath();
  }

  getBitstreamViewPath() {
    return {
      routerLink: getBitstreamViewRoute(this.bitstream),
      queryParams: {},
    };
  }

  getExtension(filename: string) {
    if (!filename) return false;
    const parts = filename.split('.');
    const fileExtensions = [
      'PDF', 'pdf', 'doc', 'DOC', 'docx', 'DOCX', 'mp3', 'MP3',
      'xlsx', 'XLSX', 'xlsm', 'XLSM', 'png', 'PNG', 'JPG', 'jpg',
      'jpeg', 'JPEG', 'mp4', 'MP4', 'pptx', 'PPTX', 'ppt', 'PPT',
    ];
    const fileCheck = parts[parts.length - 1];
    return fileExtensions.includes(fileCheck);
  }
}
