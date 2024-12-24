import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {CampaignDTO} from '../../model/campaign/campaign-dto';
import {CommunityDTO} from '../../model/community/community-dto';
import {CurrentMemberService} from '../../service/member/current-member.service';
import {CampaignService} from '../../service/campaign.service';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NgForOf} from '@angular/common';
import {PostComponent} from '../post/post.component';
import {CampaignRequest} from '../../model/campaign/campaign-request';
import {AddCampaignModalComponent} from './add-campaign-modal/add-campaign-modal.component';
import {CampaignWidgetComponent} from './campaign-widget/campaign-widget.component';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    MatPaginator,
    NgForOf,
    PostComponent,
    AddCampaignModalComponent,
    CampaignWidgetComponent
  ],
  templateUrl: './campaigns.component.html',
  styleUrl: './campaigns.component.scss'
})
export class CampaignsComponent implements OnInit {

  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  campaigns: CampaignDTO[] = [];

  @Input() communityDTO!: CommunityDTO;

  isAddEditCampaignModalOpen: boolean = false;
  editingCampaignRequest!: CampaignRequest;

  constructor(private el: ElementRef,
              private campaignService: CampaignService,
              private currentMemberService: CurrentMemberService) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.campaignService.getTableLength(this.communityDTO.id!).subscribe({
      next: (response: number) => {
        this.length = response;
      },
      error: (error) => {
        console.error(error);
      }
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
    fetchEntityLimited.optionalId = this.communityDTO.id;

    this.campaignService.fetchCampaignDTOSLimitedByCommunityId(fetchEntityLimited)
      .then((campaignDTOs: CampaignDTO[]) => {
        console.log(`Fetched ${campaignDTOs.length} campaigns`);
        campaignDTOs.sort((a, b) =>
          new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
        this.campaigns = campaignDTOs;
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }

  addCampaignOnClick() {
    this.isAddEditCampaignModalOpen = true;
    this.editingCampaignRequest = new CampaignRequest("", "", "", "", "", this.communityDTO.id!, this.currentMemberService.memberDTO!.id);
  }

  onAddEditCampaignModalChange(newVal: boolean) {
    this.isAddEditCampaignModalOpen = newVal;
  }

  onCampaignAdded(campaignDTO: CampaignDTO) {
    this.campaigns.push(campaignDTO);
    this.length++;
  }
}
