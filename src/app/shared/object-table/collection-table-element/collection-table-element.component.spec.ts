import { CollectionTableElementComponent } from './collection-table-element.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Collection } from '../../../core/shared/collection.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { TranslateModule } from '@ngx-translate/core';

let collectionTableElementComponent: CollectionTableElementComponent;
let fixture: ComponentFixture<CollectionTableElementComponent>;

const mockCollectionWithAbstract: Collection = Object.assign(new Collection(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }
});

const mockCollectionWithoutAbstract: Collection = Object.assign(new Collection(), {
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

describe('CollectionGridElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [CollectionTableElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockCollectionWithAbstract) },
        { provide: LinkService, useValue: linkService }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CollectionTableElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CollectionTableElementComponent);
    collectionTableElementComponent = fixture.componentInstance;
  }));

  describe('When the collection has an abstract', () => {
    beforeEach(() => {
      collectionTableElementComponent.object = mockCollectionWithAbstract;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).not.toBeNull();
    });
  });

  describe('When the collection has no abstract', () => {
    beforeEach(() => {
      collectionTableElementComponent.object = mockCollectionWithoutAbstract;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const collectionAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(collectionAbstractField).toBeNull();
    });
  });
});
