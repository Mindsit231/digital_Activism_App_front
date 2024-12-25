import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommunityModalComponent } from './add-community-modal.component';

describe('AddCommunityModalComponent', () => {
  let component: AddCommunityModalComponent;
  let fixture: ComponentFixture<AddCommunityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCommunityModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCommunityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
