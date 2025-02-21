import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Topic } from '../../../core/shared/topic.model';
import {
  getRemoteDataPayload,
  getFirstSucceededRemoteData,
} from '../../../core/shared/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { HALLink } from '../../../core/shared/hal-link.model';

/**
 * Component for managing a topic's roles
 */
@Component({
  selector: 'ds-topic-roles',
  templateUrl: './topic-roles.component.html',
})
export class TopicRolesComponent implements OnInit {
  dsoRD$: Observable<RemoteData<Topic>>;

  /**
   * The different roles for the topic, as an observable.
   */
  comcolRoles$: Observable<HALLink[]>;

  /**
   * The topic to manage, as an observable.
   */
  topic$: Observable<Topic>;

  constructor(protected route: ActivatedRoute) {}

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      first(),
      map((data) => data.dso)
    );

    this.topic$ = this.dsoRD$.pipe(
      getFirstSucceededRemoteData(),
      getRemoteDataPayload()
    );

    /**
     * The different roles for the topic.
     */
    this.comcolRoles$ = this.topic$.pipe(
      map((topic) => {
        return [
          {
            name: 'topic-admin',
            href: topic._links.adminGroup.href,
          },
        ];
      })
    );
  }
}
