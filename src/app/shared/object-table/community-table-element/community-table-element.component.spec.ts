import { CommunityTableElementComponent } from './community-table-element.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Community } from '../../../core/shared/community.model';
import { LinkService } from '../../../core/cache/builders/link.service';
import { TranslateModule } from '@ngx-translate/core';

let communityTableElementComponent: CommunityTableElementComponent;
let fixture: ComponentFixture<CommunityTableElementComponent>;

const mockCommunityWithAbstract: Community = Object.assign(new Community(), {
  metadata: {
    'dc.description.abstract': [
      {
        language: 'en_US',
        value: 'Short description'
      }
    ]
  }
});

const mockCommunityWithoutAbstract: Community = Object.assign(new Community(), {
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
  resolveLink: mockCommunityWithAbstract
});

describe('CommunityTableElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [CommunityTableElementComponent],
      providers: [
        { provide: 'objectElementProvider', useValue: (mockCommunityWithAbstract) },
        { provide: LinkService, useValue: linkService }
      ],

      schemas: [NO_ERRORS_SCHEMA]
    }).overrideComponent(CommunityTableElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CommunityTableElementComponent);
    communityTableElementComponent = fixture.componentInstance;
  }));

  describe('When the community has an abstract', () => {
    beforeEach(() => {
      communityTableElementComponent.object = mockCommunityWithAbstract;
      fixture.detectChanges();
    });

    it('should show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).not.toBeNull();
    });
  });

  describe('When the community has no abstract', () => {
    beforeEach(() => {
      communityTableElementComponent.object = mockCommunityWithoutAbstract;
      fixture.detectChanges();
    });

    it('should not show the description paragraph', () => {
      const communityAbstractField = fixture.debugElement.query(By.css('p.card-text'));
      expect(communityAbstractField).toBeNull();
    });
  });
});
