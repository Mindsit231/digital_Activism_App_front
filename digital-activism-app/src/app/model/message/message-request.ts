export class MessageRequest {
  text: string;
  campaignId: number;
  memberId: number;

  constructor(text: string, campaignId: number, memberId: number) {
    this.text = text;
    this.campaignId = campaignId;
    this.memberId = memberId;
  }
}
