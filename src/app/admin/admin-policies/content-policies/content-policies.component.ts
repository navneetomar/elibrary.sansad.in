import { Router } from '@angular/router';
import {
  SUBCOMMUNITY_TYPE,
  COMMUNITIES_TYPE,
} from './../../../core/config/constants';
import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';

@Component({
  selector: 'ds-content-policies',
  templateUrl: './content-policies.component.html',
})
export class ContentPoliciesComponent implements OnInit, OnChanges, OnDestroy {
  @Input() node: any;
  nodeItem: any;

  constructor(private router: Router) {}
  ngOnInit() {
    if (this.node.type === COMMUNITIES_TYPE) {
      this.nodeItem = { ...this.node, type: 'community' };
    } else if (this.node.type === SUBCOMMUNITY_TYPE) {
      this.nodeItem = { ...this.node, type: 'community' };
    } else {
      this.nodeItem = this.node;
    }
  }
  ngOnChanges(): void {
    if (this.nodeItem !== null && this.nodeItem !== undefined) {
      if (this.node.id !== this.nodeItem.id) {
        if (this.node.type === COMMUNITIES_TYPE) {
          this.nodeItem = { ...this.node, type: 'community' };
        } else if (this.node.type === SUBCOMMUNITY_TYPE) {
          this.nodeItem = { ...this.node, type: 'community' };
        } else {
          this.nodeItem = this.node;
        }
      }
    }
  }
  handleClickBistreams(id) {
    this.router.navigate([`/items/${id}/edit/bitstreams`]);
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.nodeItem = null;
  }
}
