import { map } from 'rxjs/operators';
import { Observable, count } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { TopicInfoService } from './topic-info.service';
import _ from 'lodash';

/**
 * The search box in the header that expands on focus and collapses on focus out
 */
@Component({
  selector: 'ds-topic-info',
  templateUrl: './topic-info.component.html',
  styleUrls: ['./topic-info.component.scss'],
})
export class TopicInfoComponent implements OnInit, OnDestroy {
  public results$: Observable<any>;
  public topics: any[] = [];

  page = 0;
  isLoadMore = true;
  constructor(private topicInfoService: TopicInfoService) {}
  ngOnInit(): void {
    this.results$ = this.topicInfoService
      .getTopics(0)
      .pipe(map((data) => data));
    this.results$.subscribe((data) => {
      if (data) {
        if (
          data[0]?._embedded?.topics?.length > 0 &&
          data[1]?._embedded?.entries
        ) {
          data[0]._embedded.topics.forEach((item) => {
            item.total = this.findItemInArray(
              data[1]?._embedded?.entries,
              item
            );

            this.topics.push(item);
          });
        }
      }
      this.topics = this.topics.sort(this.compare);
    });
  }
  compare(a, b) {
    if (a.total < b.total) {
      return 1;
    }
    if (a.total > b.total) {
      return -1;
    }
    return 0;
  }
  findItemInArray(array, node) {
    let item;
    if (array && node && node.name) {
      item = array.filter((item) => {
        return item.value === node.name;
      });
    }

    if (item.length > 0) {
      return item[0].count;
    } else {
      return 0;
    }
  }
  handleClick() {
    this.page++;

    this.results$ = this.topicInfoService
      .getTopics(this.page)
      .pipe(map((data) => data));
    this.results$.subscribe((data) => {
      if (data) {
        if (data?._embedded?.topics?.length > 0) {
          data._embedded.topics.map((item) => {
            this.topics.push(item);
          });
        } else if (!data._embedded) {
          this.isLoadMore = false;
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.page = 0;
    this.results$ = null;
    this.topics = [];
  }
}
