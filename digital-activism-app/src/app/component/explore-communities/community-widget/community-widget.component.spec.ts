import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityWidgetComponent } from './community-widget.component';

describe('CommunityWidgetComponent', () => {
  let component: CommunityWidgetComponent;
  let fixture: ComponentFixture<CommunityWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
