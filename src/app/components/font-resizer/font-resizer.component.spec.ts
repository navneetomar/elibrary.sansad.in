import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontResizerComponent } from './font-resizer.component';

describe('FontResizerComponent', () => {
  let component: FontResizerComponent;
  let fixture: ComponentFixture<FontResizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FontResizerComponent]
    });
    fixture = TestBed.createComponent(FontResizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
