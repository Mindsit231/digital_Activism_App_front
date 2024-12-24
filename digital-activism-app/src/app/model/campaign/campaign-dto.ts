import {MemberDTO} from '../member/member-dto';

export class CampaignDTO {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  creationDate: string;
  communityId: number;

  memberDTO: MemberDTO;

  participating: boolean;

  constructor(id: number, name: string, description: string, startDate: string,
              endDate: string, creationDate: string, communityId: number,
              memberDTOShort: MemberDTO, participating: boolean) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.creationDate = creationDate;
    this.communityId = communityId;
    this.memberDTO = memberDTOShort;
    this.participating = participating;
  }

  public static fromJson(campaignDTOJson: CampaignDTO): CampaignDTO {
    return new CampaignDTO(
      campaignDTOJson.id,
      campaignDTOJson.name,
      campaignDTOJson.description,
      campaignDTOJson.startDate,
      campaignDTOJson.endDate,
      campaignDTOJson.creationDate,
      campaignDTOJson.communityId,
      MemberDTO.fromJson(campaignDTOJson.memberDTO),
      campaignDTOJson.participating
    );
  }

  toggleParticipate() {
    this.participating = !this.participating;
  }
}
