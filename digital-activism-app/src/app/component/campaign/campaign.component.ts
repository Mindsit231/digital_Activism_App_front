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
import {CommunityDTO} from '../../model/community/community-dto';
import {MessagesComponent} from './messages/messages.component';
import {MembersComponent} from "../members/members.component";
import {MemberDTO} from '../../model/member/member-dto';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';
import {MemberService} from '../../service/member/member.service';

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
        MessagesComponent,
        MembersComponent
    ],
  templateUrl: './campaign.component.html',
  styleUrl: './campaign.component.scss'
})
export class CampaignComponent implements OnInit {

  campaignDTO!: CampaignDTO;
  communityDTO!: CommunityDTO;

  constructor(private internalContainerService: InternalContainerService,
              protected routerService: RouterService,
              protected campaignService: CampaignService,
              protected memberService: MemberService) {
  }

  ngOnInit(): void {
    this.campaignDTO = this.internalContainerService.getCampaignDTO();
    this.communityDTO = this.internalContainerService.getCommunityDTO();

    console.log("init here")
  }

  fetchMembersCountAction(): Promise<number> {
    return this.memberService.fetchMembersCountByCampaignId(this.campaignDTO.id);
  };
  fetchMembersAction(pageSize: number, pageIndex: number): Promise<MemberDTO[]> {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);
    fetchEntityLimited.optionalId = this.campaignDTO.id;
    return this.memberService.fetchMembersLimitedByCampaignId(fetchEntityLimited)
  };

  protected readonly getDateTime = getDateTime;

}
