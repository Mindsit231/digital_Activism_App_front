import {Component, Input} from '@angular/core';
import {CampaignDTO} from '../../../model/campaign/campaign-dto';
import {getDate, getDateTime} from '../../misc/functions';
import {CampaignService} from '../../../service/campaign.service';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {RouterService} from '../../../service/router.service';
import {CommunityDTO} from '../../../model/community/community-dto';

@Component({
  selector: 'app-campaign-widget',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './campaign-widget.component.html',
  styleUrl: './campaign-widget.component.scss'
})
export class CampaignWidgetComponent {

  @Input() communityDTO!: CommunityDTO;
  @Input() campaignDTO!: CampaignDTO;
  @Input() hasVisitButton: boolean = true;

  constructor(protected campaignService: CampaignService,
              protected routerService: RouterService) {}

  protected readonly getDateTime = getDateTime;

  toggleParticipate() {
    this.campaignService.toggleParticipate(this.campaignDTO.id)
      .then((response: boolean) => {
        if (response) {
          this.campaignDTO.toggleParticipate();
        }
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  protected readonly getDate = getDate;
  protected readonly faUser = faUser;
}
