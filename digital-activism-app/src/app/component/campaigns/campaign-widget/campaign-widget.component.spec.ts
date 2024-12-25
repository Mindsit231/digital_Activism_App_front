import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignWidgetComponent } from './campaign-widget.component';

describe('CampaignWidgetComponent', () => {
  let component: CampaignWidgetComponent;
  let fixture: ComponentFixture<CampaignWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaignWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
