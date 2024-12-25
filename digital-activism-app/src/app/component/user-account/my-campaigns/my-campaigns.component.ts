import {Component, ElementRef, OnInit} from '@angular/core';
import {CommunityWidgetComponent} from "../../explore-communities/community-widget/community-widget.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf} from "@angular/common";
import {CampaignWidgetComponent} from '../../campaigns/campaign-widget/campaign-widget.component';
import {CommunityDTO} from '../../../model/community/community-dto';
import {CommunityService} from '../../../service/community.service';
import {FetchEntityLimited} from '../../../model/misc/fetch-entity-limited';
import {CampaignDTO} from '../../../model/campaign/campaign-dto';
import {CampaignService} from '../../../service/campaign.service';

@Component({
  selector: 'app-my-campaigns',
  standalone: true,
  imports: [
    CommunityWidgetComponent,
    MatPaginator,
    NgForOf,
    CampaignWidgetComponent
  ],
  templateUrl: './my-campaigns.component.html',
  styleUrl: './my-campaigns.component.scss'
})
export class MyCampaignsComponent implements OnInit{
  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  campaigns: CampaignDTO[] = [];

  constructor(private el: ElementRef,
              private campaignService: CampaignService) {

  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.campaignService.fetchCampaignsCountByMemberId()
      .then((count: number) => {
        this.length = count;
      })
      .catch((error: Error) => {
        console.error(error);
      })

    this.fetchCampaigns(this.pageIndex, this.pageSize);
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.fetchCampaigns($event.pageIndex, $event.pageSize);
  }

  private fetchCampaigns(pageIndex: number, pageSize: number) {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);

    this.campaignService.fetchCampaignDTOSLimitedByMemberId(fetchEntityLimited)
      .then((campaigns: CampaignDTO[]) => {
        console.log(`Fetched ${campaigns.length} campaigns`);
        campaigns.sort((a, b) =>
          new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
        this.campaigns = campaigns;
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }
}
