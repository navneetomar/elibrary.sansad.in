import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of as observableOf } from 'rxjs';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { CommunityDataService } from '../../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../../core/data/dso-change-analyzer.service';
import { buildPaginatedList } from '../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { Bitstream } from '../../../../../core/shared/bitstream.model';
import { HALEndpointService } from '../../../../../core/shared/hal-endpoint.service';
import { Item } from '../../../../../core/shared/item.model';
import { PageInfo } from '../../../../../core/shared/page-info.model';
import { UUIDService } from '../../../../../core/shared/uuid.service';
import { NotificationsService } from '../../../../notifications/notifications.service';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../../utils/truncate.pipe';
import { ItemSearchResultTableElementComponent } from './item-search-result-table-element.component';

const mockItemWithMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithMetadata.hitHighlights = {};
mockItemWithMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald'
      }
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26'
      }
    ],
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'This is an abstract'
      }
    ]
  }
});

const mockItemWithoutMetadata: ItemSearchResult = new ItemSearchResult();
mockItemWithoutMetadata.hitHighlights = {};
mockItemWithoutMetadata.indexableObject = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(buildPaginatedList(new PageInfo(), [])),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ]
  }
});

describe('ItemTableElementComponent', getEntityTableElementTestComponent(ItemSearchResultTableElementComponent, mockItemWithMetadata, mockItemWithoutMetadata, ['authors', 'date', 'abstract']));

/**
 * Create test cases for a Table component of an entity.
 * @param component                     The component's class
 * @param searchResultWithMetadata      An ItemSearchResult containing an item with metadata that should be displayed in the Table element
 * @param searchResultWithoutMetadata   An ItemSearchResult containing an item that's missing the metadata that should be displayed in the Table element
 * @param fieldsToCheck                 A list of fields to check. The tests expect to find html elements with class ".item-${field}", so make sure they exist in the html template of the Table element.
 *                                      For example: If one of the fields to check is labeled "authors", the html template should contain at least one element with class ".item-authors" that's
 *                                      present when the author metadata is available.
 */
export function getEntityTableElementTestComponent(component, searchResultWithMetadata: ItemSearchResult, searchResultWithoutMetadata: ItemSearchResult, fieldsToCheck: string[]) {
  return () => {
    let comp;
    let fixture;

    const truncatableServiceStub: any = {
      isCollapsed: (id: number) => observableOf(true),
    };

    const mockBitstreamDataService = {
      getThumbnailFor(item: Item): Observable<RemoteData<Bitstream>> {
        return createSuccessfulRemoteDataObject$(new Bitstream());
      }
    };

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          NoopAnimationsModule,
          TranslateModule.forRoot()
        ],
        declarations: [component, TruncatePipe],
        providers: [
          { provide: TruncatableService, useValue: truncatableServiceStub },
          { provide: ObjectCacheService, useValue: {} },
          { provide: UUIDService, useValue: {} },
          { provide: Store, useValue: {} },
          { provide: RemoteDataBuildService, useValue: {} },
          { provide: CommunityDataService, useValue: {} },
          { provide: HALEndpointService, useValue: {} },
          { provide: HttpClient, useValue: {} },
          { provide: DSOChangeAnalyzer, useValue: {} },
          { provide: NotificationsService, useValue: {} },
          { provide: DefaultChangeAnalyzer, useValue: {} },
          { provide: BitstreamDataService, useValue: mockBitstreamDataService },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(component, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      }).compileComponents();
    }));

    beforeEach(waitForAsync(() => {
      fixture = TestBed.createComponent(component);
      comp = fixture.componentInstance;
    }));

    fieldsToCheck.forEach((field) => {
      describe(`when the item has "${field}" metadata`, () => {
        beforeEach(() => {
          comp.object = searchResultWithMetadata;
          fixture.detectChanges();
        });

        it(`should show the "${field}" field`, () => {
          const itemAuthorField = fixture.debugElement.query(By.css(`.item-${field}`));
          expect(itemAuthorField).not.toBeNull();
        });
      });

      describe(`when the item has no "${field}" metadata`, () => {
        beforeEach(() => {
          comp.object = searchResultWithoutMetadata;
          fixture.detectChanges();
        });

        it(`should not show the "${field}" field`, () => {
          const itemAuthorField = fixture.debugElement.query(By.css(`.item-${field}`));
          expect(itemAuthorField).toBeNull();
        });
      });
    });
  };
}
