import { COLLECTION } from './../../../core/shared/collection.resource-type';
import {
  COMMUNITY_TYPE,
  COLLECTION_TYPE,
  ITEM_TYPE,
  BITSTREAM_TYPE,
} from './../../../core/config/constants';
import { Data } from '@angular/router';
import { AdminPoliciesService } from './../admin-policies.service';
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'ds-detail-policies',
  templateUrl: './detail-policies.component.html',
})
export class DetailPoliciesComponent implements OnInit, OnChanges {
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  @Input() node: any;
  public resultsData$: Observable<any>;
  subcribe: Subscription;
  dataResult: any;
  constructor(private adminPoliciesService: AdminPoliciesService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.loadData(this.node.id, this.node.type);
  }
  ngOnInit(): void {
    this.loadData(this.node.id, this.node.type);
  }
  loadData(id, type) {
    if (id && type) {
      if (type === COMMUNITY_TYPE) {
        this.resultsData$ = this.adminPoliciesService
          .getDetailCommunity(this.node.id)
          .pipe(map((data) => data));
        this.subcribe = this.resultsData$.subscribe((data) => {
          this.dataResult = data;
          return data;
        });
      } else if (type === COLLECTION_TYPE) {
        this.resultsData$ = this.adminPoliciesService
          .getDetailCollection(this.node.id)
          .pipe(map((data) => data));
        this.subcribe = this.resultsData$.subscribe((data) => {
          this.dataResult = data;
          return data;
        });
      } else if (type === ITEM_TYPE) {
        this.resultsData$ = this.adminPoliciesService
          .getDetailItem(this.node.id)
          .pipe(map((data) => data));
        this.subcribe = this.resultsData$.subscribe((data) => {
          this.dataResult = data;
          return data;
        });
      } else if (type === BITSTREAM_TYPE) {
        this.resultsData$ = this.adminPoliciesService
          .getDetailBitsteam(this.node.id)
          .pipe(map((data) => data));
        this.subcribe = this.resultsData$.subscribe((data) => {
          this.dataResult = data;
          return data;
        });
      }
    }
  }
}
