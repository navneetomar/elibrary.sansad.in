import { Observable } from 'rxjs';
import { Topic } from '../core/shared/topic.model';

import { ShowMoreFlatNode } from './show-more-flat-node.model';

/**
 * Each node in the tree is represented by a flatNode which contains info about the node itself and its position and
 *  state in the tree. There are nodes representing communities, collections and show more links.
 */
export interface FlatNode {
  isExpandable$: Observable<boolean>;
  name: string;
  id: string;
  level: number;
  isExpanded?: boolean;
  parent?: FlatNode;
  payload: Topic | ShowMoreFlatNode;
  isShowMoreNode: boolean;
  route?: string;
  currentTopicPage?: number;
}
