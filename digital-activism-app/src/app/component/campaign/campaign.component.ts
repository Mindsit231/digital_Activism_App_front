import {Component, OnInit} from '@angular/core';
import {InternalObjectService} from '../../service/misc/internal-object.service';
import {CampaignDTO} from '../../model/campaign/campaign-dto';
import {RouterService} from '../../service/router.service';
import {CampaignService} from '../../service/campaign.service';
import {InternalContainerService} from '../../service/misc/internal-container.service';
import {getDateTime} from '../misc/functions';
import {CampaignsComponent} from '../campaigns/campaigns.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {PostsComponent} from '../posts/posts.component';
import {CommunityWidgetComponent} from '../explore-communities/community-widget/community-widget.component';
import {CampaignWidgetComponent} from '../campaigns/campaign-widget/campaign-widget.component';
import {CommunityDTO} from '../../model/community-dto';
import {MessagesComponent} from './messages/messages.component';

@Component({
  selector: 'app-campaign',
  standalone: true,
  imports: [
    CampaignsComponent,
    MatTab,
    MatTabGroup,
    PostsComponent,
    CommunityWidgetComponent,
    CampaignWidgetComponent,
    MessagesComponent
  ],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.scss'
})
export class CampaignComponent implements OnInit {

  campaignDTO!: CampaignDTO;
  communityDTO!: CommunityDTO;

  constructor(private internalContainerService: InternalContainerService,
              protected routerService: RouterService,
              protected campaignService: CampaignService) {
  }

  ngOnInit(): void {
    this.campaignDTO = this.internalContainerService.getCampaignDTO();
    this.communityDTO = this.internalContainerService.getCommunityDTO();
  }

  protected readonly getDateTime = getDateTime;
}
