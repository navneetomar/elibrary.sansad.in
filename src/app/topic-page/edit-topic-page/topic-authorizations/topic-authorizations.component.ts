import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { RemoteData } from '../../../core/data/remote-data';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';

@Component({
  selector: 'ds-topic-authorizations',
  templateUrl: './topic-authorizations.component.html',
})
/**
 * Component that handles the topic Authorizations
 */
export class TopicAuthorizationsComponent<TDomain extends DSpaceObject>
  implements OnInit
{
  /**
   * The initial DSO object
   */
  public dsoRD$: Observable<RemoteData<TDomain>>;

  /**
   * Initialize instance variables
   *
   * @param {ActivatedRoute} route
   */
  constructor(private route: ActivatedRoute) {}

  /**
   * Initialize the component, setting up the topic
   */
  ngOnInit(): void {
    this.dsoRD$ = this.route.parent.parent.data.pipe(
      first(),
      map((data) => data.dso)
    );
  }
}
