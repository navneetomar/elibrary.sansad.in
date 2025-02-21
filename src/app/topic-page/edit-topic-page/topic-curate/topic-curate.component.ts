import { Component, OnInit } from '@angular/core';
import { Topic } from '../../../core/shared/topic.model';
import { ActivatedRoute } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { Observable } from 'rxjs';
import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { hasValue } from '../../../shared/empty.util';

/**
 * Component for managing a topic's curation tasks
 */
@Component({
  selector: 'ds-topic-curate',
  templateUrl: './topic-curate.component.html',
})
export class TopicCurateComponent implements OnInit {
  dsoRD$: Observable<RemoteData<Topic>>;
  topicName$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private dsoNameService: DSONameService
  ) {}

  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.data.pipe(
      take(1),
      map((data) => data.dso)
    );

    this.topicName$ = this.dsoRD$.pipe(
      filter((rd: RemoteData<Topic>) => hasValue(rd)),
      map((rd: RemoteData<Topic>) => {
        return this.dsoNameService.getName(rd.payload);
      })
    );
  }
}
