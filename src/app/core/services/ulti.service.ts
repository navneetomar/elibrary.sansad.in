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




// import {
//   getFirstCompletedRemoteData,
//   getFirstSucceededRemoteData,
// } from '../core/shared/operators';

import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { followLink } from '../../shared/utils/follow-link-config.model';



/**
 * Creates a flatNode from a community or collection
 * @param c               The community or collection this flatNode represents
 * @param isExpandable    Whether or not this node is expandable (true if it has children)
 * @param level           Level indicating how deep in the tree this node should be rendered
 * @param isExpanded      Whether or not this node already is expanded
 * @param parent          Parent of this node (flatNode representing its parent community)
 */

/**
 * Creates a show More flatnode where only the level and parent are of importance
 */


// Selectors the get the communityList data out of the store

/**
 * Service class for the community list, responsible for the creating of the flat list used by communityList dataSource
 *  and connection to the store to retrieve and save the state of the community list
 */
@Injectable()
export class UltiService {
  private pageSize: number;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private store: Store<any>,
    private http: HttpClient
  ) {
    this.pageSize = appConfig.topicList.pageSize;
  }



  getAllType() {
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/browses?size=9999`
    );
  }
  getAllCollection(){
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/discover/search/objects?size=9999&dsoType=COLLECTION`
    );
  }
  getAllCommunitiesTop(){
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/search/top?page=0&size=999&sort=dc.title,ASC&embed.size=subcommunities=1&embed=subcommunities&embed.size=collections=1&embed=collections`
    );
  }
  
  getCollectionsByCommunityId(id){
    return this.http.get<any>(
      `${this.appConfig.rest.baseUrl}/api/core/communities/${id}/collections?size=99`
    );
  }
  /**
   * Gets all top communities, limited by page, and transforms this in a list of flatNodes.
   * @param findOptions       FindListOptions
   * @param expandedNodes     List of expanded nodes; if a node is not expanded its subCommunities and collections need
   *                            not be added to the list
   */


  /**
   * Puts the initial top level communities in a list to be called upon
   */


  /**
   * Transforms a list of communities to a list of FlatNodes according to the instructions detailed in transformCommunity
   * @param listOfPaginatedTopics
   * @param level                         Level the tree is currently at
   * @param parent                        FlatNode of the parent of this list of communities
   * @param expandedNodes                 List of expanded nodes; if a node is not expanded its subcommunities and collections need not be added to the list
   */


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


  /**
   * Checks if a community has subcommunities or collections by querying the respective services with a pageSize = 0
   *      Returns an observable that combines the result.payload.totalElements fo the observables that the
   *          respective services return when queried
   * @param topic
   */

}
