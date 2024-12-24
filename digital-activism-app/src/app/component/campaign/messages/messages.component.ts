import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MessageListElementComponent} from './message-list-element/message-list-element.component';
import {NgForOf, NgIf} from '@angular/common';
import {MessageListElement} from './message-list-element/message-list-element';
import {FormsModule} from '@angular/forms';
import {MessageRequest} from '../../../model/message/message-request';
import {MessageService} from '../../../service/message.service';
import {MessageDTO} from '../../../model/message/message-dto';
import {CurrentMemberService} from '../../../service/member/current-member.service';
import {CampaignDTO} from '../../../model/campaign/campaign-dto';
import {FetchEntityLimited} from '../../../model/misc/fetch-entity-limited';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    MessageListElementComponent,
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent implements OnInit {

  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  messageListElements: MessageListElement[] = [];
  messageTyped: string = "";

  @Input() campaignDTO!: CampaignDTO;

  @ViewChild('messageAreaDiv') messageAreaDiv!: ElementRef;

  constructor(private el: ElementRef,
              protected messageService: MessageService,
              protected currentMemberService: CurrentMemberService) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.messageService.getTableLength(this.campaignDTO.id!).subscribe({
      next: (response: number) => {
        this.length = response;
      },
      error: (error) => {
        console.error(error);
      }
    })

    this.fetchMessages(this.pageIndex, this.pageSize).subscribe({
      next: () => {
        this.scrollToBottom();
      },
      error: (error: Error) => {
        console.error(error);
      }
    });
  }

  private fetchMessages(pageIndex: number, pageSize: number): Observable<any> {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);
    fetchEntityLimited.optionalId = this.campaignDTO.id;

    return new Observable((observer) => {
      this.messageService.fetchLatestMessageDTOSLimitedByCampaignId(fetchEntityLimited)
        .then((messageDTOS: MessageDTO[]) => {
          console.log(messageDTOS)
          console.log(`Fetched ${messageDTOS.length} messages`);
          messageDTOS.sort((a, b) => {
            return a.id! - b.id!
          });
          messageDTOS.map((messageDTO: MessageDTO) =>
            new MessageListElement(messageDTO, this.currentMemberService.memberDTO!.id)).reverse()
            .forEach(messageListElement => this.messageListElements.unshift(messageListElement));
          observer.next();
        })
        .catch((error: Error) => {
          console.error(error);
          observer.error(error);
        })
    });
  }

  onMessageEnter() {
    console.log("Message typed: " + this.messageTyped);

    if (this.messageTyped.length > 0) {
      let messageRequest = new MessageRequest(
        this.messageTyped, this.campaignDTO.id, this.currentMemberService.memberDTO!.id);

      this.messageService.addMessage(messageRequest)
        .then((messageDTOJson: MessageDTO) => {
          this.updateMessageLists(MessageDTO.fromJson(messageDTOJson));
          this.messageTyped = "";
        })
        .catch((error: Error) => {
          console.log(error);
        });
    }
  }

  private updateMessageLists(messageDTO: MessageDTO) {
    this.messageListElements.push(new MessageListElement(messageDTO, this.currentMemberService.memberDTO!.id));

    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      let messageAreaDivEl = this.messageAreaDiv.nativeElement;
      messageAreaDivEl.scrollTop = Math.max(0, messageAreaDivEl.scrollHeight - messageAreaDivEl.offsetHeight);
    }, 5);
  }

  onScroll($event: Event) {
    const target = $event.target as HTMLElement;

    if (target.scrollTop === 0) {
      this.fetchMessages(++this.pageIndex, this.pageSize).subscribe({
        next: () => {
          let messageAreaDivEl = this.messageAreaDiv.nativeElement;
          messageAreaDivEl.scrollTop = 30;
        },
        error: (error: Error) => {
          console.error(error);
        }
      })
    }
  }
}
