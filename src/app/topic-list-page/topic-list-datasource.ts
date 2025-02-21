import { hasValue } from '../shared/empty.util';
import { TopicListService } from './topic-list-service';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FlatNode } from './flat-node.model';
import { FindListOptions } from '../core/data/find-list-options.model';

/**
 * DataSource object needed by a CDK Tree to render its nodes.
 * The list of FlatNodes that this DataSource object represents gets created in the topicListService at
 *    the beginning (initial page-limited top communities) and re-calculated any time the tree state changes
 *    (a node gets expanded or page-limited result become larger by triggering a show more node)
 */
export class TopicListDatasource implements DataSource<FlatNode> {
  private topicList$ = new BehaviorSubject<FlatNode[]>([]);
  public loading$ = new BehaviorSubject<boolean>(false);
  private subLoadTopics: Subscription;

  constructor(private topicListService: TopicListService) {}

  connect(collectionViewer: CollectionViewer): Observable<FlatNode[]> {
    return this.topicList$.asObservable();
  }

  loadTopics(findOptions: FindListOptions, expandedNodes: FlatNode[]) {
    this.loading$.next(true);
    if (hasValue(this.subLoadTopics)) {
      this.subLoadTopics.unsubscribe();
    }
    this.subLoadTopics = this.topicListService
      .loadTopics(findOptions, expandedNodes)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe((flatNodes: FlatNode[]) => {
        this.topicList$.next(flatNodes);
      });
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.topicList$.complete();
    this.loading$.complete();
  }
}
