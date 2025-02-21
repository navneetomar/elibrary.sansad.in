import { Component, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';

@Component({
  selector: 'ds-table-policies',
  templateUrl: './table-policies.component.html',
})
export class TablePoliciesComponent {
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  @Input() node: any;

  constructor() {}
}
