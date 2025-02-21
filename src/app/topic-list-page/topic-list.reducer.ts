import {
  TopicListActions,
  TopicListActionTypes,
  TopicListSaveAction,
} from './topic-list.actions';
import { FlatNode } from './flat-node.model';

/**
 * States we wish to put in store concerning theTopic list
 */
export interface TopicListState {
  expandedNodes: FlatNode[];
  loadingNode: FlatNode;
}

/**
 * Initial starting state of the list of expandedNodes and the current loading node of theTopic list
 */
const initialState: TopicListState = {
  expandedNodes: [],
  loadingNode: null,
};

/**
 * Reducer to interact with store concerning objects for theTopic list
 * @constructor
 */
export function TopicListReducer(
  state = initialState,
  action: TopicListActions
) {
  switch (action.type) {
    case TopicListActionTypes.SAVE: {
      return Object.assign({}, state, {
        expandedNodes: (action as TopicListSaveAction).payload.expandedNodes,
        loadingNode: (action as TopicListSaveAction).payload.loadingNode,
      });
    }
    default: {
      return state;
    }
  }
}
