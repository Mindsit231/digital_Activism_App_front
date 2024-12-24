import {MemberDTO} from '../member/member-dto';

export class MessageDTO {
  id: number;
  text: string;
  timestamp: string;
  campaignId: number;
  memberId: number;

  memberDTO: MemberDTO;

  constructor(id: number, text: string, timestamp: string, campaignId: number, memberId: number, memberDTO: MemberDTO) {
    this.id = id;
    this.text = text;
    this.timestamp = timestamp;
    this.campaignId = campaignId;
    this.memberId = memberId;
    this.memberDTO = memberDTO;
  }

  public static fromJson(messageDTOJson: any): MessageDTO {
    return new MessageDTO(
      messageDTOJson.id,
      messageDTOJson.text,
      messageDTOJson.timestamp,
      messageDTOJson.campaignId,
      messageDTOJson.memberId,
      MemberDTO.fromJson(messageDTOJson.memberDTO)
    );
  }
}
