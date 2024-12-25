import {Injectable} from "@angular/core";
import {CommunityDTO} from '../../model/community/community-dto';
import {CampaignDTO} from '../../model/campaign/campaign-dto';

@Injectable({
  providedIn: 'root'
})
export class InternalContainerService {
  communityDTO!: CommunityDTO;
  campaignDTO!: CampaignDTO;

  protected constructor() {
  }

  setCommunityDTO(communityDTO: CommunityDTO) {
    this.communityDTO = communityDTO;
  }

  getCommunityDTO(): CommunityDTO {
    return this.communityDTO!;
  }

  setCampaignDTO(campaignDTO: CampaignDTO) {
    this.campaignDTO = campaignDTO;
  }

  getCampaignDTO(): CampaignDTO {
    return this.campaignDTO!;
  }
}
