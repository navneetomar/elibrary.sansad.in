import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of as observableOf } from 'rxjs';
import { RemoteDataBuildService } from '../../../../core/cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { DefaultChangeAnalyzer } from '../../../../core/data/default-change-analyzer.service';
import { DSOChangeAnalyzer } from '../../../../core/data/dso-change-analyzer.service';
import { Collection } from '../../../../core/shared/collection.model';
import { HALEndpointService } from '../../../../core/shared/hal-endpoint.service';
import { UUIDService } from '../../../../core/shared/uuid.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import { TruncatePipe } from '../../../utils/truncate.pipe';
import { CollectionSearchResultTableElementComponent } from './collection-search-result-table-element.component';
import { BitstreamFormatDataService } from '../../../../core/data/bitstream-format-data.service';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TranslateModule } from '@ngx-translate/core';

let collectionSearchResultTableElementComponent: CollectionSearchResultTableElementComponent;
let fixture: ComponentFixture<CollectionSearchResultTableElementComponent>;

const truncatableServiceStub: any = {
  isCollapsed: (id: number) => observableOf(true),
};

const mockCollectionWithAbstract: CollectionSearchResult = new CollectionSearchResult();
mockCollectionWithAbstract.hitHighlights = {};
mockCollectionWithAbstract.indexableObject = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }
});

const mockCollectionWithoutAbstract: CollectionSearchResult = new CollectionSearchResult();
mockCollectionWithoutAbstract.hitHighlights = {};
mockCollectionWithoutAbstract.indexableObject = Object.assign(new Collection(), {
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'Test title'
      }
    ]
  }
});
const linkService = jasmine.createSpyObj('linkService', {
  resolveLink: mockCollectionWithAbstract
});

describe('CollectionSearchResultTableElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [CollectionSearchResultTableElementComponent, TruncatePipe],
      providers: [
        { provide: TruncatableService, useValue: truncatableServiceStub },
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract) },
        { provide: ObjectCacheService, useValue: {} },
        { provide: UUIDService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: RemoteDataBuildService, useValue: {} },
        { provide: BitstreamDataService, useValue: {} },
        { provide: CommunityDataService, useValue: {} },
        { provide: HALEndpointService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: HttpClient, useValue: {} },
        { provide: DSOChangeAnalyzer, useValue: {} },
        { provide: DefaultChangeAnalyzer, useValue: {} },
        { provide: BitstreamFormatDataService, useValue: {} },
        { provide: LinkService, useValue: linkService }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CollectionSearchResultTableElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CollectionSearchResultTableElementComponent);
    collectionSearchResultTableElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionSearchResultTableElementComponent.dso = mockCollectionWithAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionSearchResultTableElementComponent.dso = mockCollectionWithoutAbstract.indexableObject;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });
});
