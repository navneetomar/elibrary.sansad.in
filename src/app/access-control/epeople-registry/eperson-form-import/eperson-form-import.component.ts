import { getValueNameCookie } from 'src/app/core/config/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ScriptDataService } from './../../../core/data/processes/script-data.service';
import { NotificationsService } from './../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Component({
  selector: 'ds-eperson-form-import',
  templateUrl: './eperson-form-import.component.html',
})
/**
 * A form used for creating and editing EPeople
 */
export class EPersonFormImportComponent implements OnInit {
  @Input() isDelete: boolean;
  /**
   * The current value of the file
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  fileObject: File;

  /**
   * The validate only flag
   */
  // eslint-disable-next-line @typescript-eslint/member-ordering
  validateOnly = true;
  @Output() reloadData = new EventEmitter();
  public constructor(
    private location: Location,
    protected translate: TranslateService,
    protected notificationsService: NotificationsService,
    private scriptDataService: ScriptDataService,
    public http: HttpClient,
    private router: Router,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {}
  ngOnInit() {
    console.log('');
  }
  /**
   * Set file
   * @param file
   */
  setFile(file) {
    this.fileObject = file;
  }

  /**
   * When return button is pressed go to previous location
   */
  public onReturn() {
    // this.location.back();
    // window.location.reload();
    this.reloadData.emit();
  }

  /**
   * Starts import-metadata script with -f fileName (and the selected file)
   */
  public importMetadata() {
    if (this.fileObject == null) {
      this.notificationsService.error(
        this.translate.get('admin.metadata-import.page.error.addFile')
      );
    } else {
      let match = getValueNameCookie('XSRF-TOKEN');
      let headers = new HttpHeaders({
        'X-XSRF-TOKEN': match,
      });
      let options = { headers: headers };

      let formData: any = new FormData();
      formData.append('file', this.fileObject);
      this.http
        .post<any>(
          `${
            this.appConfig.rest.baseUrl
          }/api/dladmin/accesscontrol/importepeople${
            this.isDelete ? 'todelete' : ''
          }`,
          formData,
          options
        )
        .subscribe({
          next: (data) => {
            console.log('data,import', data);
          },
          error: (error) => {
            console.error('There was an error!', error);
            if (error && error.status === 200) {
              const title = this.translate.get(
                'process.new.notification.success.title'
              );
              const content = this.translate.get(
                'process.new.notification.success.content'
              );
              this.notificationsService.success(title, content);
              setTimeout(() => {
                // this.router.navigate(['/access-control/epeople'], {
                //   queryParams: { 'elp.page': '1' },
                // });
                // this.reloadData.emit();
                window.location.reload();
              }, 1500);
            } else {
              const title = this.translate.get(
                'process.new.notification.error.title'
              );
              const content = this.translate.get(
                'process.new.notification.error.content'
              );
              this.notificationsService.error(title, content);
            }
          },
        });
    }
  }
}
