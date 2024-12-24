import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCampaignModalComponent } from './add-campaign-modal.component';

describe('AddCampaignModalComponent', () => {
  let component: AddCampaignModalComponent;
  let fixture: ComponentFixture<AddCampaignModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCampaignModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCampaignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
