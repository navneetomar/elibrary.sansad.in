import { HttpClient } from '@angular/common/http';
/* eslint-disable max-classes-per-file */
import { Inject, Injectable } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';

import {
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

import { AppState } from '../app.reducer';

import { FindListOptions } from '../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../core/data/paginated-list.model';
import { RemoteData } from '../core/data/remote-data';
import { TopicDataService } from '../core/data/topic-data.service';

import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
} from '../core/shared/operators';

import { PageInfo } from '../core/shared/page-info.model';
import { Topic } from '../core/shared/topic.model';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';
import { getTopicPageRoute } from '../topic-page/topic-page-routing-paths';
import { FlatNode } from './flat-node.model';
import { ShowMoreFlatNode } from './show-more-flat-node.model';

import { TopicListSaveAction } from './topic-list.actions';
import { TopicListState } from './topic-list.reducer';

// Helper method to combine an flatten an array of observables of flatNode arrays
export const combineAndFlatten = (
  obsList: Observable<FlatNode[]>[]
): Observable<FlatNode[]> =>
  observableCombineLatest([...obsList]).pipe(
    map((matrix: any[][]) => [].concat(...matrix)),
    filter((arr: any[]) => arr.every((e) => hasValue(e)))
  );

/**
 * Creates a flatNode from a community or collection
 * @param c               The community or collection this flatNode represents
 * @param isExpandable    Whether or not this node is expandable (true if it has children)
 * @param level           Level indicating how deep in the tree this node should be rendered
 * @param isExpanded      Whether or not this node already is expanded
 * @param parent          Parent of this node (flatNode representing its parent community)
 */
export const toFlatNode = (
  c: Topic,
  isExpandable: Observable<boolean>,
  level: number,
  isExpanded: boolean,
  parent?: FlatNode
): FlatNode => ({
  isExpandable$: isExpandable,
  name: c.name,
  id: c.id,
  level: level,
  isExpanded,
  parent,
  payload: c,
  isShowMoreNode: false,
  route: getTopicPageRoute(c.id),
});

/**
 * Creates a show More flatnode where only the level and parent are of importance
 */
export const showMoreFlatNode = (
  id: string,
  level: number,
  parent: FlatNode
): FlatNode => ({
  isExpandable$: observableOf(false),
  name: 'Show More Flatnode',
  id: id,
  level: level,
  isExpanded: false,
  parent: parent,
  payload: new ShowMoreFlatNode(),
  isShowMoreNode: true,
});

// Selectors the get the communityList data out of the store
const topicListStateSelector = (state: AppState) => state.topicList;
const expandedNodesSelector = createSelector(
  topicListStateSelector,
  (topicList: TopicListState) => topicList.expandedNodes
);
const loadingNodeSelector = createSelector(
  topicListStateSelector,
  (topicList: TopicListState) => topicList.loadingNode
);

/**
 * Service class for the community list, responsible for the creating of the flat list used by communityList dataSource
 *  and connection to the store to retrieve and save the state of the community list
 */
@Injectable()
export class TopicListService {
  private pageSize: number;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private topicDataService: TopicDataService,
    private store: Store<any>,
    private http: HttpClient
  ) {
    this.pageSize = appConfig.topicList.pageSize;
  }

  private configOnePage: FindListOptions = Object.assign(
    new FindListOptions(),
    {
      elementsPerPage: 1,
    }
  );

  saveTopicListStateToStore(
    expandedNodes: FlatNode[],
    loadingNode: FlatNode
  ): void {
    this.store.dispatch(new TopicListSaveAction(expandedNodes, loadingNode));
  }

  getExpandedNodesFromStore(): Observable<FlatNode[]> {
    return this.store.select(expandedNodesSelector);
  }

  getLoadingNodeFromStore(): Observable<FlatNode> {
    return this.store.select(loadingNodeSelector);
  }

  getEntriesTopic(page: number = 0) {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/browses/topic/entries?sort=default,ASC&page=${page}&size=1000`
    );
  }
  /**
   * Gets all top communities, limited by page, and transforms this in a list of flatNodes.
   * @param findOptions       FindListOptions
   * @param expandedNodes     List of expanded nodes; if a node is not expanded its subCommunities and collections need
   *                            not be added to the list
   */
  loadTopics(
    findOptions: FindListOptions,
    expandedNodes: FlatNode[]
  ): Observable<FlatNode[]> {
    const currentPage = findOptions.currentPage;
    const topTopics = [];
    for (let i = 1; i <= currentPage; i++) {
      const pagination: FindListOptions = Object.assign({}, findOptions, {
        currentPage: i,
      });
      topTopics.push(this.getTopTopics(pagination));
    }
    const topComs$ = observableCombineLatest([...topTopics]).pipe(
      map((coms: PaginatedList<Topic>[]) => {
        const newPages: Topic[][] = coms.map(
          (unit: PaginatedList<Topic>) => unit.page
        );
        const newPage: Topic[] = [].concat(...newPages);
        let newPageInfo = new PageInfo();
        if (coms && coms.length > 0) {
          newPageInfo = Object.assign({}, coms[0].pageInfo, { currentPage });
        }
        return buildPaginatedList(newPageInfo, newPage);
      })
    );
    return topComs$.pipe(
      switchMap((topComs: PaginatedList<Topic>) =>
        this.transformListOfTopics(topComs, 0, null, expandedNodes)
      )
      // distinctUntilChanged((a: FlatNode[], b: FlatNode[]) => a.length === b.length)
    );
  }

  /**
   * Puts the initial top level communities in a list to be called upon
   */
  private getTopTopics(
    options: FindListOptions
  ): Observable<PaginatedList<Topic>> {
    return this.topicDataService
      .findTop(
        {
          currentPage: options.currentPage,
          elementsPerPage: this.pageSize,
          sort: {
            field: options.sort.field,
            direction: options.sort.direction,
          },
        },

        followLink('mainTopic', { findListOptions: this.configOnePage }),
        followLink('subtopics', { findListOptions: this.configOnePage })
      )
      .pipe(
        getFirstSucceededRemoteData(),
        map((results) => results.payload)
      );
  }

  /**
   * Transforms a list of communities to a list of FlatNodes according to the instructions detailed in transformCommunity
   * @param listOfPaginatedTopics
   * @param level                         Level the tree is currently at
   * @param parent                        FlatNode of the parent of this list of communities
   * @param expandedNodes                 List of expanded nodes; if a node is not expanded its subcommunities and collections need not be added to the list
   */
  public transformListOfTopics(
    listOfPaginatedTopics: PaginatedList<Topic>,
    level: number,
    parent: FlatNode,
    expandedNodes: FlatNode[]
  ): Observable<FlatNode[]> {
    if (isNotEmpty(listOfPaginatedTopics.page)) {
      let currentPage = listOfPaginatedTopics.currentPage;
      if (isNotEmpty(parent)) {
        currentPage = expandedNodes.find(
          (node: FlatNode) => node.id === parent.id
        ).currentTopicPage;
      }
      let obsList = listOfPaginatedTopics.page.map((topic: Topic) => {
        return this.transformTopic(topic, level, parent, expandedNodes);
      });
      if (
        currentPage < listOfPaginatedTopics.totalPages &&
        currentPage === listOfPaginatedTopics.currentPage
      ) {
        obsList = [
          ...obsList,
          observableOf([showMoreFlatNode('topic', level, parent)]),
        ];
      }

      return combineAndFlatten(obsList);
    } else {
      return observableOf([]);
    }
  }

  /**
   * Transforms a community in a list of FlatNodes containing firstly a flatnode of the community itself,
   *      followed by flatNodes of its possible subcommunities and collection
   * It gets called recursively for each subcommunity to add its subcommunities and collections to the list
   * Number of subcommunities and collections added, is dependant on the current page the parent is at for respectively subcommunities and collections.
   * @param topic
   * @param level             Depth of the community in the list, subcommunities and collections go one level deeper
   * @param parent            Flatnode of the parent community
   * @param expandedNodes     List of nodes which are expanded, if node is not expanded, it need not add its page-limited subcommunities or collections
   */
  public transformTopic(
    topic: Topic,
    level: number,
    parent: FlatNode,
    expandedNodes: FlatNode[]
  ): Observable<FlatNode[]> {
    let isExpanded = false;
    if (isNotEmpty(expandedNodes)) {
      isExpanded = hasValue(expandedNodes.find((node) => node.id === topic.id));
    }

    const isExpandable$ = this.getIsExpandable(topic);

    const topicFlatNode = toFlatNode(
      topic,
      isExpandable$,
      level,
      isExpanded,
      parent
    );

    let obsList = [observableOf([topicFlatNode])];

    if (isExpanded) {
      const currentTopicPage = expandedNodes.find(
        (node: FlatNode) => node.id === topic.id
      ).currentTopicPage;
      let subcoms = [];
      for (let i = 1; i <= currentTopicPage; i++) {
        const nextSetOfSubtopicsPage = this.topicDataService
          .findByParent(
            topic.uuid,
            {
              elementsPerPage: this.pageSize,
              currentPage: i,
            },
            followLink('subtopics', {
              findListOptions: this.configOnePage,
            })
          )
          .pipe(
            getFirstCompletedRemoteData(),
            switchMap((rd: RemoteData<PaginatedList<Topic>>) => {
              if (hasValue(rd) && hasValue(rd.payload)) {
                return this.transformListOfTopics(
                  rd.payload,
                  level + 1,
                  topicFlatNode,
                  expandedNodes
                );
              } else {
                return observableOf([]);
              }
            })
          );

        subcoms = [...subcoms, nextSetOfSubtopicsPage];
      }

      obsList = [...obsList, combineAndFlatten(subcoms)];
    }

    return combineAndFlatten(obsList);
  }

  /**
   * Checks if a community has subcommunities or collections by querying the respective services with a pageSize = 0
   *      Returns an observable that combines the result.payload.totalElements fo the observables that the
   *          respective services return when queried
   * @param topic
   */
  public getIsExpandable(topic: Topic): Observable<boolean> {
    let hasSubcoms$: Observable<boolean>;

    hasSubcoms$ = this.topicDataService
      .findByParent(topic.uuid, this.configOnePage)
      .pipe(
        map((rd: RemoteData<PaginatedList<Topic>>) => {
          if (hasValue(rd) && hasValue(rd.payload)) {
            return rd.payload.totalElements > 0;
          } else {
            return false;
          }
        })
      );

    let hasChildren$: Observable<boolean>;
    hasChildren$ = observableCombineLatest(hasSubcoms$).pipe(
      map(([hasSubcoms]: [boolean]) => hasSubcoms)
    );

    return hasChildren$;
  }
}
