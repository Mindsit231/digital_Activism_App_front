export class CampaignRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  creationDate: string;
  communityId: number;
  memberId: number;


  constructor(name: string, description: string, startDate: string, endDate: string, creationDate: string, communityId: number, memberId: number) {
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.creationDate = creationDate;
    this.communityId = communityId;
    this.memberId = memberId;
  }
}
