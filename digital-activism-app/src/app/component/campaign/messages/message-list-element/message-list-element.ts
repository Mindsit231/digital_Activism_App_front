import {MessageDTO} from '../../../../model/message/message-dto';

export class MessageListElement {
  messageDTO: MessageDTO;
  messageType: MessageType;
  position: MessagePosition;

  constructor(messageDTO: MessageDTO, currentUserId: number) {
    this.messageDTO = messageDTO;
    this.messageType = this.setMessageType(messageDTO, currentUserId);
    this.position = this.setPosition(messageDTO, currentUserId)
  }

  private setMessageType(messageDTO: MessageDTO, currentUserId: number) {
    if (messageDTO.memberId == currentUserId) {
      return ownerMessageType;
    } else {
      return foreignMessageType;
    }
  }

  private setPosition(messageDTO: MessageDTO, currentUserId: number) {
    if (messageDTO.memberId == currentUserId) {
      return MessagePosition.END;
    } else {
      return MessagePosition.START;
    }
  }
}

class MessageType {
  backgroundClass: string;

  constructor(backgroundClass: string) {
    this.backgroundClass = backgroundClass;
  }
}

enum MessagePosition {
  START = "start",
  END = "end",
}

export const ownerMessageType = new MessageType("owner-message-type");
export const foreignMessageType = new MessageType("foreign-message-type");
