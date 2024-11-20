import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreCommunitiesComponent } from './explore-communities.component';

describe('ExploreCommunitiesComponent', () => {
  let component: ExploreCommunitiesComponent;
  let fixture: ComponentFixture<ExploreCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreCommunitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
