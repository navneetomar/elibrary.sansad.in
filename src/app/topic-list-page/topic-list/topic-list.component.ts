import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { take } from 'rxjs/operators';
import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { isEmpty } from '../../shared/empty.util';
import { FlatNode } from '../flat-node.model';
import { TopicListDatasource } from '../topic-list-datasource';
import { TopicListService } from '../topic-list-service';

/**
 * A tree-structured list of nodes representing the communities, their subCommunities and collections.
 * Initially only the page-restricted top communities are shown.
 * Each node can be expanded to show its children and all children are also page-limited.
 * More pages of a page-limited result can be shown by pressing a show more node/link.
 * Which nodes were expanded is kept in the store, so this persists across pages.
 */
@Component({
  selector: 'ds-topic-list',
  templateUrl: './topic-list.component.html',
  styleUrls: ['./topic-list.component.scss'],
})
export class TopicListComponent implements OnInit, OnDestroy {
  private expandedNodes: FlatNode[] = [];
  public loadingNode: FlatNode;

  treeControl = new FlatTreeControl<FlatNode>(
    (node: FlatNode) => node.level,
    (node: FlatNode) => true
  );

  dataSource: TopicListDatasource;
  entriesTopic = [];
  paginationConfig: FindListOptions;

  constructor(private topicListService: TopicListService) {
    this.paginationConfig = new FindListOptions();
    this.paginationConfig.elementsPerPage = 2;
    this.paginationConfig.currentPage = 1;
    this.paginationConfig.sort = new SortOptions('dc.title', SortDirection.ASC);
  }
  ngOnInit() {
    this.dataSource = new TopicListDatasource(this.topicListService);
    this.topicListService.getEntriesTopic().subscribe((data) => {
      if (data) {
        this.entriesTopic = data._embedded.entries;
      }
    });
    this.topicListService
      .getLoadingNodeFromStore()
      .pipe(take(1))
      .subscribe((result) => {
        this.loadingNode = result;
      });
    this.topicListService
      .getExpandedNodesFromStore()
      .pipe(take(1))
      .subscribe((result) => {
        this.expandedNodes = [...result];
        this.dataSource.loadTopics(this.paginationConfig, this.expandedNodes);
      });
  }

  ngOnDestroy(): void {
    this.topicListService.saveTopicListStateToStore(
      this.expandedNodes,
      this.loadingNode
    );
    // this.dataTree.unsubscribe();
    this.entriesTopic = [];
  }

  trackByStudentID = (index: number, item: any) => item;
  // whether or not this node has children (subcommittees or collections)
  hasChild(_: number, node: FlatNode) {
    return node.isExpandable$;
  }

  // whether or not it is a show more node (contains no data, but is indication that there are more topcoms, subcoms or collections
  isShowMore(_: number, node: FlatNode) {
    return node.isShowMoreNode;
  }

  /**
   * Toggles the expanded variable of a node, adds it to the expanded nodes list and reloads the tree so this node is expanded
   * @param node  Node we want to expand
   */
  toggleExpanded(node: FlatNode) {
    this.loadingNode = node;
    if (node.isExpanded) {
      this.expandedNodes = this.expandedNodes.filter(
        (node2) => node2.name !== node.name
      );
      node.isExpanded = false;
    } else {
      this.expandedNodes.push(node);
      node.isExpanded = true;
      // if (isEmpty(node.currentCollectionPage)) {
      //   node.currentCollectionPage = 1;
      // }
      if (isEmpty(node.currentTopicPage)) {
        node.currentTopicPage = 1;
      }
    }
    this.dataSource.loadTopics(this.paginationConfig, this.expandedNodes);
  }
  findItemInArray(array, node) {
    let item;
    if (array && node && node.name) {
      item = array.filter((item) => {
        return item?.value === node.name;
      });
    }

    if (item.length > 0) {
      return item[0].count;
    } else {
      return 0;
    }
  }
  /**
   * Makes sure the next page of a node is added to the tree (top topic, sub topic of collection)
   *      > Finds its parent (if not top topic) and increases its corresponding collection/subcommunity currentPage
   *      > Reloads tree with new page added to corresponding top topic lis, sub community list or collection list
   * @param node  The show more node indicating whether it's an increase in top communities, sub communities or collections
   */
  getNextPage(node: FlatNode): void {
    this.loadingNode = node;
    if (node.parent != null) {
      // if (node.id === 'collection') {
      //   const parentNodeInExpandedNodes = this.expandedNodes.find(
      //     (node2: FlatNode) => node.parent.id === node2.id
      //   );
      //   parentNodeInExpandedNodes.currentCollectionPage++;
      // }
      if (node.id === 'topic') {
        const parentNodeInExpandedNodes = this.expandedNodes.find(
          (node2: FlatNode) => node.parent.id === node2.id
        );
        parentNodeInExpandedNodes.currentTopicPage++;
      }
      this.dataSource.loadTopics(this.paginationConfig, this.expandedNodes);
    } else {
      this.paginationConfig.currentPage++;
      this.dataSource.loadTopics(this.paginationConfig, this.expandedNodes);
    }
  }
}
