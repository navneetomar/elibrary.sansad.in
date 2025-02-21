import { Bitstream } from './../../../core/shared/bitstream.model';
import {
  BITSTREAM_TYPE,
  COMMUNITIES_TYPE,
  COMMUNITY_TO_TOP,
  handleMoveBitstreamToItem,
  handleMoveCommunityToTop,
  handleMoveSubcommunityToSubcommunity,
  ITEM_TYPE,
  SUBCOMMUNITY_TYPE,
} from './../../../core/config/constants';

import { HttpClient } from '@angular/common/http';
import {
  Component,
  Inject,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  SimpleChange,
  OnChanges,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { demoData, TreeNode, DropInfo } from './data';

import { debounce } from '@agentepsilon/decko';
import { map, Observable, Subject, take } from 'rxjs';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line lodash/import-scope
import _ from 'lodash';
import {
  COLLECTION_TYPE,
  getOptionsSystem,
  handleMoveCollectionToSubcommunity,
  handleMoveItemToCollection,
} from 'src/app/core/config/constants';

import { node } from 'prop-types';
import { Router } from '@angular/router';

import { TreeDropDragService } from './tree-drop-drag.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { APP_CONFIG, AppConfig } from 'src/config/app-config.interface';

@Component({
  selector: 'ds-tree-drop-drag',
  templateUrl: './tree-drop-drag.component.html',
  styleUrls: ['./tree-drop-drag.component.scss'],
})
/**
 * Component displaying the contents of the Help Statement
 */
export class TreeDropDragComponent implements OnInit, OnDestroy, OnChanges {
  @Input() dataInput: any;
  @Input() querySearch: string;

  dataBuilder: any;
  dataSearch: string;
  nodesBuilder: TreeNode[] = demoData;

  nodesBuilderOriginal: TreeNode[];

  // ids for connected drop lists
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: DropInfo = null;

  counter = 0; // check loading node first
  counterClick = 0; // check load more  node
  isLoadmore = true; // check loading node
  isLoadmorePrev = true;
  prevIdNode = ''; // previous node
  currentIdNode = ''; // current node id
  nodeCurrent: any; // node current
  nodeIdLoadmorePrevious = ''; // id node load more previous
  listItemTemp = []; // list item temp
  listCollectionTemp = []; //list collection temp
  listSubcommunitesTemp = []; //list subcommun temp
  listCommunitiesTemp = []; //list commun temp
  listBitstreamTemp = []; //list bistream temp
  listClicked = []; //list node clicked
  idNodeClicked = ''; //id node clicked
  public eventsSubscription: Subscription;

  loadDept$ = new Subject<any>();

  nodeCheckbox: any;

  @Output() nodeCheckedOutput = new EventEmitter<any>();
  @Output() refreshDataParent = new EventEmitter<boolean>();
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    private modalService: NgbModal,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private http: HttpClient,
    private router: Router,
    private treeService: TreeDropDragService
  ) {
    // this.prepareDragDrop(this.nodes);
  }

  ngOnInit() {
    this.dataBuilder = this.dataInput;

    this.nodesBuilder = this.builderTreeNotes(this.dataBuilder);
    this.nodesBuilderOriginal = this.nodesBuilder;

    this.prepareDragDrop(this.nodesBuilderOriginal);
  }

  builderTreeNotes(builderData: any) {
    let arrayBuilder: TreeNode[] = [];
    if (builderData && builderData.length > 0) {
      builderData.map((item) => {
        let data1 = {
          id: item.id,
          name: item.name,
          children: [],
          type: COMMUNITIES_TYPE,
          isExpanded: false,
        };
        let data2 = {
          id: item.id,
          name: item.name,
          children: [],
          type: COMMUNITIES_TYPE,

          parentId: item.id,
          parentName: item.name,
          parentType: COMMUNITIES_TYPE,
          isExpanded: false,
        };
        arrayBuilder.push(data1);
        this.listCommunitiesTemp.push(data2);
      });
    }
    return arrayBuilder;
  }
  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    let change: SimpleChange = changes.querySearch;

    this.isLoadmore = false; // stop load more item
    this.nodeCheckedOutput.emit(null);
    this.nodeCheckbox = false;
    if (change && change.currentValue === '') {
      if (this.nodesBuilderOriginal) {
        this.nodesBuilder = this.nodesBuilderOriginal;
        this.prepareDragDrop(this.nodesBuilder);
      }
    } else if (change && change.currentValue !== '') {
      this.nodesBuilder = this.searchDataTree(
        this.nodesBuilder,
        change.currentValue
      );
      this.prepareDragDrop(this.nodesBuilder);
    } else {
      this.nodesBuilder = this.nodesBuilderOriginal;
      this.prepareDragDrop(this.nodesBuilder);
    }
  }

  searchDataTree(arr, searchString) {
    return _.filter(arr, function (obj) {
      return obj.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
    });
  }

  prepareDragDrop(nodes: TreeNode[]) {
    if (nodes.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      nodes.forEach((node) => {
        this.dropTargetIds.push(node.id);
        this.dropTargetIds.push(node.name);
        this.dropTargetIds.push(node.type);
        this.dropTargetIds.push(node.link);
        this.dropTargetIds.push(node.isExpanded);
        this.nodeLookup[node.id] = node;
        this.prepareDragDrop(node.children);
      });
    }
  }

  @debounce(50)
  dragMoved(event) {
    let e = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!e) {
      this.clearDragInfo();
      return;
    }
    let container = e.classList.contains('node-item')
      ? e
      : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;

    if (event.pointerPosition.y - targetRect.top < oneThird) {
      // before
      this.dropActionTodo.action = 'before';
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      // after
      this.dropActionTodo.action = 'after';
    } else {
      // inside
      this.dropActionTodo.action = 'inside';
    }
    this.showDragInfo();
  }

  drop(event) {
    if (!this.dropActionTodo) {
      return;
    }
    const draggedItemId = event.item.data; //id item current
    const parentItemId = event.previousContainer.id; //id parent item current
    //this.dropActionTodo.targetId  ---- id item moved from
    let parentNextID = null;
    let type = this.getTypeNoteById(
      draggedItemId,
      this.listCollectionTemp,
      this.listItemTemp,
      this.listSubcommunitesTemp,
      this.listBitstreamTemp
    );

    if (type === COLLECTION_TYPE) {
      parentNextID = this.handleParentIdMoveCollectionToSub(
        this.dropActionTodo.action,
        this.dropActionTodo.targetId,
        this.listCollectionTemp,
        this.listSubcommunitesTemp
      );
    } else if (type === ITEM_TYPE) {
      parentNextID = this.handleParentIdMoveItemToCollection(
        this.dropActionTodo.action,
        this.dropActionTodo.targetId,
        this.listItemTemp
      );
    } else if (type === SUBCOMMUNITY_TYPE) {
      const index = this.listCommunitiesTemp.findIndex(
        (object) => object.id === this.dropActionTodo.targetId
      );
      if (index !== -1) {
        parentNextID = COMMUNITY_TO_TOP;
      } else {
        parentNextID = this.handleParentIdMoveSubToSub(
          this.dropActionTodo.action,
          this.dropActionTodo.targetId,
          this.listSubcommunitesTemp,
          this.listCommunitiesTemp
        );
      }
    } else if (type === BITSTREAM_TYPE) {
      parentNextID = this.handleParentIdMoveBitstreamToItem(
        this.dropActionTodo.action,
        this.dropActionTodo.targetId,
        this.listBitstreamTemp
      );
    } else {
      parentNextID = this.handleParentIdMoveCollectionToSub(
        this.dropActionTodo.action,
        this.dropActionTodo.targetId,
        this.listCollectionTemp,
        this.listSubcommunitesTemp
      );
    }

    const targetListId = this.getParentNodeId(
      this.dropActionTodo.targetId,
      this.nodesBuilder,
      'main'
    );

    // console.log(
    //   '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
    //   '\n[' +
    //     this.dropActionTodo.action +
    //     ']\n[' +
    //     this.dropActionTodo.targetId +
    //     '] from list [' +
    //     targetListId +
    //     ']'
    // );
    // console.log('parentNextID', parentNextID);

    this.showModalComfirm(
      draggedItemId,
      parentItemId,
      this.dropActionTodo.targetId,
      parentNextID,
      type
    );
    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer =
      parentItemId !== 'main'
        ? this.nodeLookup[parentItemId].children
        : this.nodesBuilder;
    const newContainer =
      targetListId !== 'main'
        ? this.nodeLookup[targetListId].children
        : this.nodesBuilder;

    let i = oldItemContainer.findIndex((c) => c.id === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex(
          (c) => c.id === this.dropActionTodo.targetId
        );
        if (this.dropActionTodo.action === 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(
          draggedItem
        );
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }

    this.clearDragInfo(true);
  }

  //show madal after drap and drop node

  showModalComfirm(currentID, currentParentId, nextID, nextParentID, type) {
    const modalRef = this.modalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.isComfirmPolicy = true;
    modalRef.componentInstance.dso = '';
    modalRef.componentInstance.headerLabel =
      'confirmation-modal.policies.header';
    modalRef.componentInstance.infoLabel = 'confirmation-modal.policies.info';
    modalRef.componentInstance.cancelLabel =
      'confirmation-modal.policies.cancel';
    modalRef.componentInstance.confirmLabel =
      'confirmation-modal.policies.confirm';
    modalRef.componentInstance.brandColor = 'success';
    modalRef.componentInstance.confirmIcon = 'fas fa-folder';
    modalRef.componentInstance.responsePolicy
      .pipe(
        map((data) => {
          return data;
        })
      )
      .subscribe((data) => {
        if (data.comfirm) {
          let bodyPost = null;
          if (type === COLLECTION_TYPE) {
            bodyPost = handleMoveCollectionToSubcommunity(
              currentID,
              nextParentID,
              data.applyToSub,
              data.inherit
            );
          }
          if (type === ITEM_TYPE) {
            bodyPost = handleMoveItemToCollection(
              currentID,
              nextParentID,
              data.applyToSub,
              data.inherit
            );
          }
          if (type === SUBCOMMUNITY_TYPE) {
            if (nextParentID === COMMUNITY_TO_TOP) {
              bodyPost = handleMoveCommunityToTop(
                currentID,
                data.applyToSub,
                data.inherit
              );
            } else {
              bodyPost = handleMoveSubcommunityToSubcommunity(
                currentID,
                nextParentID,
                data.applyToSub,
                data.inherit
              );
            }
          }
          if (type === BITSTREAM_TYPE) {
            bodyPost = handleMoveBitstreamToItem(
              currentID,
              nextParentID,
              data.applyToSub,
              data.inherit
            );
          }

          let urlPost = '';
          if (nextParentID === COMMUNITY_TO_TOP) {
            urlPost = `${this.appConfig.rest.baseUrl}/api/dladmin/manage-dspace-object/movecommtotop`;
          } else {
            urlPost = `${this.appConfig.rest.baseUrl}/api/dladmin/manage-dspace-object/movedsobj`;
          }
          this.http.post<any>(urlPost, bodyPost, getOptionsSystem()).subscribe({
            next: (data1) => {
              console.log(data1);
            },
            error: (error) => {
              console.error('There was an error!', error);
              if (error && error.status === 200) {
                if (error?.error.text === 'Success') {
                  this.notificationsService.success(
                    this.translateService.get(error?.error.text)
                  );
                } else {
                  this.notificationsService.warning(
                    this.translateService.get(error?.error.text)
                  );
                }

                setTimeout(() => {
                  this.refreshDataParent.emit(true);
                }, 2000);
              } else {
                error?.error.message
                  ? this.notificationsService.error(
                      this.translateService.get(error?.error.message)
                    )
                  : this.notificationsService.error(
                      this.translateService.get(error?.error)
                    );
                setTimeout(() => {
                  this.refreshDataParent.emit(true);
                }, 2000);
              }
            },
          });
        } else {
          // setTimeout(() => {
          //   this.refreshDataParent.emit(true);
          // }, 2000);
        }
      });
  }
  // get id parent node from
  getParentNodeIdCustom(idNode, nodesToSearch) {
    let parentId = null;
    let nodesToSearchTemp = nodesToSearch.filter(function (element) {
      return element !== undefined;
    });
    nodesToSearchTemp.forEach((node) => {
      if (node.id === idNode) {
        parentId = node.parentId;
      }
    });
    return parentId;
  }
  // get type node drop
  getTypeNoteById(id, listColl, listItem, listSub, listBitstream) {
    let type = null;
    listColl.forEach((item) => {
      if (this.checkIdInObject(id, item)) {
        type = item.type;
        return type;
      }
    });
    listItem.forEach((item) => {
      if (this.checkIdInObject(id, item)) {
        type = item.type;
        return type;
      }
    });
    listSub.forEach((item) => {
      if (this.checkIdInObject(id, item)) {
        type = item.type;
        return type;
      }
    });
    listBitstream.forEach((item) => {
      if (this.checkIdInObject(id, item)) {
        type = item.type;
        return type;
      }
    });
    return type;
  }
  // check id in object return true or false

  checkIdInObject(id, obj) {
    return _.includes(obj, id);
  }

  // check id in array object if exists id not push else push
  handlePushObjectNotExistId(arr, obj, node, type) {
    arr.forEach((item) => {
      if (this.checkIdInObject(obj.id, item) === false) {
        arr.push({
          id: obj.id,
          name: obj.name,
          parentId: node.id,
          parentName: node.name,
          type: type,
        });
      }
    });
  }

  getParentNodeId(
    id: string,
    nodesToSearch: TreeNode[],
    parentId: string
  ): string {
    nodesToSearch.forEach((item) => {
      if (item.id === id) {
        return parentId;
      }
      if (item.children.length > 0) {
        let ret = this.getParentNodeId(id, item.children, item.id);
        if (ret) {
          return parentId;
        }
      }
    });

    return null;
  }
  showDragInfo() {
    this.clearDragInfo();

    if (this.dropActionTodo) {
      this.document
        .getElementById('node-' + this.dropActionTodo.targetId)
        .classList.add('drop-' + this.dropActionTodo.action);
    }
  }
  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = null;
    }
    this.document
      .querySelectorAll('.drop-before')
      .forEach((element) => element.classList.remove('drop-before'));
    this.document
      .querySelectorAll('.drop-after')
      .forEach((element) => element.classList.remove('drop-after'));
    this.document
      .querySelectorAll('.drop-inside')
      .forEach((element) => element.classList.remove('drop-inside'));
  }
  // click button load more item in collection
  handleLoadMoreItem(node) {
    if (
      this.nodeIdLoadmorePrevious !== node.id &&
      this.nodeIdLoadmorePrevious !== ''
    ) {
      this.counterClick = 0;
      this.nodeIdLoadmorePrevious = node.id;
      this.isLoadmore = true;
      this.loadMoreBuildItemNodes(node, this.counterClick);
    } else if (this.nodeIdLoadmorePrevious === '') {
      this.counterClick = 0;
      this.nodeIdLoadmorePrevious = node.id;
      this.isLoadmore = true;
      this.loadMoreBuildItemNodes(node, this.counterClick);
    } else if (this.nodeIdLoadmorePrevious === node.id) {
      if (this.isLoadmorePrev === true) {
        this.loadMoreBuildItemNodes(node, this.counterClick);
      } else {
        this.isLoadmore = false;
        this.isLoadmorePrev = true;
        return;
      }
    }
  }
  // click node
  handleClick(node) {
    this.counter++;
    this.nodeCurrent = node;
    // console.log('node-click', node);
    if (!!this.prevIdNode === true) {
      if (this.prevIdNode === node.id) {
        node.isExpanded = !node.isExpanded;
        return;
      }
    } else {
      this.prevIdNode = this.currentIdNode;
      this.currentIdNode = node.id;

      this.buildNodesByType(node);
    }
    this.prevIdNode = this.currentIdNode;
    this.currentIdNode = node.id;

    const index = this.listClicked.findIndex((object) => object.id === node.id);

    if (index === -1) {
      this.listClicked.push({
        id: node.id,
      });
      if (this.prevIdNode !== this.currentIdNode) {
        this.buildNodesByType(node);
      }
    } else {
      node.isExpanded = !node.isExpanded;
      return;
    }
    this.nodesBuilderOriginal = this.nodesBuilder;
  }
  // build node sub by type node
  buildNodesByType(node) {
    if (node.type === SUBCOMMUNITY_TYPE) {
      this.buildSubNotes(node);
      return;
    } else if (node.type === COLLECTION_TYPE) {
      this.isLoadmore = true;
      this.buildItemNodes(node);
      return;
    } else if (node.type === COMMUNITIES_TYPE) {
      this.buildSubOfCommunitesNodes(node);
      return;
    } else if (node.type === ITEM_TYPE) {
      this.buildBistreamsOfItemNode(node);
      return;
    } else {
      return;
    }
  }

  // click build item node
  buildItemNodes(node) {
    node.isExpanded = !node.isExpanded;
    this.idNodeClicked = node.id;
    if (node.children.length === 0) {
      this.treeService
        .getAllItemCollection(this.currentIdNode, 0)
        .subscribe((data) => {
          this.loadDept$.next(data);
          if (data) {
            if (
              data &&
              data._embedded.searchResult._embedded.objects.length > 0
            ) {
              data._embedded.searchResult._embedded.objects.map((item) => {
                node.children.push({
                  id: item._embedded.indexableObject.id,
                  name: item._embedded.indexableObject.name,
                  type: item._embedded.indexableObject.type,
                  children: [],
                  isExpanded: false,
                });
                this.listItemTemp.push({
                  id: item._embedded.indexableObject.id,
                  name: item._embedded.indexableObject.name,
                  parentId: node.id,
                  parentName: node.name,
                  parentType: node.type,
                  type: 'item',
                  isExpanded: false,
                });
              });
            }
          }
        });
    } else {
      this.handleLoadMoreItem(node);
    }
  }
  loadMoreBuildItemNodes(node, page) {
    this.counterClick++;
    if (this.isLoadmore === true) {
      this.treeService
        .getAllItemCollection(this.currentIdNode, this.counterClick)
        .subscribe((data) => {
          this.loadDept$.next(data);
          if (data) {
            if (data._embedded.searchResult._embedded.objects.length > 0) {
              data._embedded.searchResult._embedded.objects.map((item) => {
                node.children.push({
                  id: item._embedded.indexableObject.id,
                  name: item._embedded.indexableObject.name,
                  type: item._embedded.indexableObject.type,
                  children: [],
                  isExpanded: false,
                });
                this.listItemTemp.push({
                  id: item._embedded.indexableObject.id,
                  name: item._embedded.indexableObject.name,
                  parentId: node.id,
                  parentName: node.name,
                  parentType: node.type,
                  type: 'item',
                  isExpanded: false,
                });
              });
            } else {
              this.isLoadmore = false;
              this.isLoadmorePrev = false;
            }
          }
        });
    }

    this.counter++;
  }
  // click build sub node
  buildSubNotes(node) {
    node.isExpanded = !node.isExpanded;
    this.idNodeClicked = node.id;
    if (node.children.length === 0) {
      this.treeService.getAllDataNote(this.currentIdNode).subscribe((data) => {
        this.loadDept$.next(data);
        if (data) {
          if (data && data[0]._embedded.subcommunities.length > 0) {
            data[0]._embedded.subcommunities.map((subComm) => {
              node.children.push({
                id: subComm.id,
                name: subComm.name,
                type: SUBCOMMUNITY_TYPE,
                children: [],
                isExpanded: false,
              });
              this.listSubcommunitesTemp.push({
                id: subComm.id,
                name: subComm.name,
                type: SUBCOMMUNITY_TYPE,
                parentId: node.id,
                parentName: node.name,
                parentType: node.type,
                children: [],
                isExpanded: false,
              });
            });
          }
          if (data && data[1]._embedded.collections.length > 0) {
            data[1]._embedded.collections.map((coll) => {
              node.children.push({
                id: coll.id,
                name: coll.name,
                type: COLLECTION_TYPE,
                children: [],
                isExpanded: false,
              });
              this.listCollectionTemp.push({
                id: coll.id,
                name: coll.name,
                type: COLLECTION_TYPE,
                parentId: node.id,
                parentName: node.name,
                parentType: node.type,
                children: [],
                isExpanded: false,
              });
            });
          }
        }
      });
    }
  }

  // click build sub in communities node
  buildSubOfCommunitesNodes(node) {
    this.idNodeClicked = node.id;
    node.isExpanded = !node.isExpanded;

    if (node.children.length === 0) {
      this.treeService.getAllDataNote(this.currentIdNode).subscribe((data) => {
        this.loadDept$.next(data);
        if (data) {
          if (data && data[0]._embedded.subcommunities.length > 0) {
            data[0]._embedded.subcommunities.map((subComm) => {
              node.children.push({
                id: subComm.id,
                name: subComm.name,
                type: SUBCOMMUNITY_TYPE,
                children: [],
                isExpanded: false,
              });
              this.listSubcommunitesTemp.push({
                id: subComm.id,
                name: subComm.name,
                type: SUBCOMMUNITY_TYPE,
                parentId: node.id,
                parentName: node.name,
                parentType: COMMUNITIES_TYPE,
                children: [],
                isExpanded: false,
              });
            });
          }
          if (data && data[1]._embedded.collections.length > 0) {
            data[1]._embedded.collections.map((coll) => {
              node.children.push({
                id: coll.id,
                name: coll.name,
                type: COLLECTION_TYPE,
                children: [],
                isExpanded: false,
              });
              this.listCollectionTemp.push({
                id: coll.id,
                name: coll.name,
                type: COLLECTION_TYPE,
                parentId: node.id,
                parentName: node.name,
                paremtType: COMMUNITIES_TYPE,
                children: [],
                isExpanded: false,
              });
            });
          }
        }
      });
    }
  }
  // click build bistream in item node
  buildBistreamsOfItemNode(node) {
    this.idNodeClicked = node.id;
    node.isExpanded = !node.isExpanded;

    if (node.children.length === 0) {
      this.treeService
        .getAllBundlesItems(this.currentIdNode)
        .subscribe((data) => {
          this.loadDept$.next(data);
          if (
            data &&
            data._embedded &&
            data._embedded.bundles &&
            data._embedded.bundles.length > 0
          ) {
            data._embedded.bundles.forEach((bundle) => {
              this.treeService
                .getBitstreamItembyBundle(bundle.uuid)
                .subscribe((item) => {
                  this.loadDept$.next(data);
                  if (
                    item &&
                    item._embedded &&
                    item._embedded.bitstreams &&
                    item._embedded.bitstreams.length > 0
                  ) {
                    item._embedded.bitstreams.forEach((bistream) => {
                      node.children.push({
                        id: bistream.id,
                        bundleName: bistream.bundleName,
                        name: this.buildStringByLength(bistream.name, 35),
                        type: bistream.type,
                        children: [],
                        isExpanded: false,
                      });
                      this.listBitstreamTemp.push({
                        id: bistream.id,
                        bundleName: bistream.bundleName,
                        name: this.buildStringByLength(bistream.name, 35),
                        parentId: node.id,
                        parentName: node.name,
                        parentType: node.type,
                        type: bistream.type,
                        isExpanded: false,
                      });
                    });
                  }
                });
            });
          } else {
            console.log('error');
          }
        });
    }
  }
  //get parent id target (move collection to subcommunity or community)

  handleParentIdMoveCollectionToSub(action, id, listColl, listSub) {
    let parentNextID = null;

    if (action === 'inside') {
      parentNextID = id;
    } else if (action === 'before') {
      const index = listColl.findIndex((object) => object.id === id);
      if (index === -1) {
        parentNextID = this.getParentNodeIdCustom(id, listSub);
      } else {
        parentNextID = this.getParentNodeIdCustom(id, listColl);
      }
    } else {
      parentNextID = this.getParentNodeIdCustom(id, listSub);
    }
    return parentNextID;
  }

  handleParentIdMoveSubToSub(action, id, listSub, listComm) {
    let parentNextID = null;

    if (action === 'inside') {
      parentNextID = id;
    } else if (action === 'before') {
      const index = listSub.findIndex((object) => object.id === id);
      if (index === -1) {
        parentNextID = this.getParentNodeIdCustom(id, listComm);
      } else {
        parentNextID = this.getParentNodeIdCustom(id, listSub);
      }
    } else {
      parentNextID = this.getParentNodeIdCustom(id, listSub);
    }
    return parentNextID;
  }
  handleParentIdMoveItemToCollection(action, id, listItem) {
    let parentNextID = null;
    if (action === 'inside') {
      parentNextID = id;
    } else {
      parentNextID = this.getParentNodeIdCustom(id, listItem);
    }
    return parentNextID;
  }
  handleParentIdMoveBitstreamToItem(action, id, listBitstream) {
    let parentNextID = null;
    if (action === 'inside') {
      parentNextID = id;
    } else {
      parentNextID = this.getParentNodeIdCustom(id, listBitstream);
    }
    return parentNextID;
  }

  //reload component after showmodal cancel or comfirm
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  addNewItem(value) {
    this.nodeCheckedOutput.emit(value);
  }
  handleChangeSelectNode(e) {
    this.nodeCheckedOutput.emit(this.nodeCheckbox);
  }
  buildStringByLength(text, number) {
    if (text) {
      if (text.length > number) {
        return text.slice(0, number) + '...';
      } else {
        return text;
      }
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    }
  }
  ngOnDestroy(): void {
    this.counter = 0;
    this.prevIdNode = '';
    this.currentIdNode = '';
    this.listItemTemp = [];
    this.listCollectionTemp = [];
    this.listSubcommunitesTemp = [];
    this.listClicked = [];
    this.idNodeClicked = '';
    this.nodeCurrent = null;

    // this.nodesBuilderOriginal = null;
  }
}
