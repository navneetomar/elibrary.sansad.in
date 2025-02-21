import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthorProfileService } from './author-profile.service';

/**
 * The search box in the header that expands on focus and collapses on focus out
 */
@Component({
  selector: 'ds-author-profile',
  templateUrl: './author-profile.component.html',
  styleUrls: ['./author-profile.component.scss'],
})
export class AuthorProfileComponent implements OnInit, OnDestroy {
  public results$: Observable<any>;
  public persons = [];
  page = 0;
  isLoadMore = true;
  constructor(private authpService: AuthorProfileService) {}
  ngOnInit(): void {
    this.results$ = this.authpService
      .getAuthorProfile(0)
      .pipe(map((data) => data));
    this.results$.subscribe((data) => {
      if (data) {
        if (data._embedded.searchResult._embedded.objects.length > 0) {
          data._embedded.searchResult._embedded.objects.map((item) => {
            if (
              this.checkLengthArray(
                item._embedded.indexableObject.metadata[
                  'relation.isPublicationOfAuthor'
                ]
              )
            ) {
              item.total =
                item._embedded.indexableObject.metadata[
                  'relation.isPublicationOfAuthor'
                ].length;
            } else {
              item.total = 0;
            }
            this.persons.push(item);
          });
        }
      }
      this.persons = this.persons.sort(this.compare);
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
  handleClick() {
    this.page++;
    this.results$ = this.authpService
      .getAuthorProfile(this.page)
      .pipe(map((data) => data));
    this.results$.subscribe((data) => {
      if (data) {
        if (data._embedded.searchResult._embedded.objects.length > 0) {
          data._embedded.searchResult._embedded.objects.map((item) => {
            this.persons.push(item);
          });
        } else {
          this.isLoadMore = false;
        }
      }
    });
  }
  checkLengthArray(array) {
    if (array && array.length > 0) {
      return true;
    }
    return false;
  }
  ngOnDestroy(): void {
    this.page = 0;
    this.results$ = null;
  }
}
