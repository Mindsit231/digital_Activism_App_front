import {Injectable} from '@angular/core';
import {EntityService} from './entity.service';
import {MessageDTO} from '../model/message/message-dto';
import {HttpClient} from '@angular/common/http';
import {MESSAGE_ENTITY} from './entity-names';
import {MessageRequest} from '../model/message/message-request';
import {MemberService} from './member/member.service';
import {Observable} from 'rxjs';
import {FetchEntityLimited} from '../model/misc/fetch-entity-limited';
import {CampaignDTO} from '../model/campaign/campaign-dto';
import {TokenService} from './token.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends EntityService<MessageDTO> {

  constructor(http: HttpClient,
              protected override tokenService: TokenService,
              public override memberService: MemberService) {
    super(http, MESSAGE_ENTITY);
  }

  public fetchLatestMessageDTOSLimitedByCampaignId(fetchEntityLimited: FetchEntityLimited): Promise<MessageDTO[]> {
    let postDTOObs: Observable<MessageDTO[]> = this.http.post<MessageDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-latest-limited-by-campaign-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      }
    );

    return this.initializeDTOObss(postDTOObs, this.initializeMessageDTO);
  }

  public getTableLength(campaignId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiBackendUrl}/authenticated/message/get-table-length-by-campaign-id`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          campaignId: campaignId.toString()
        }
      });
  }

  addMessage(messageRequest: MessageRequest): Promise<MessageDTO> {
    let postDTOObs = this.http.post<MessageDTO>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/add`,
      messageRequest,
      {
        headers: this.tokenService.getAuthHeaders()
      }
    );

    return this.initializeDTOObs(postDTOObs, this.initializeMessageDTO);
  }

  private initializeMessageDTO(messageDTOJson: MessageDTO, options?: {
    memberService?: MemberService
  }): Promise<MessageDTO> {
    return new Promise<MessageDTO>((resolve, reject) => {
      if (messageDTOJson == undefined) {
        reject(new Error("MessageDTOJson is undefined"));
      }

      let messageDTO: MessageDTO = MessageDTO.fromJson(messageDTOJson);

      new Observable<MessageDTO>((subscriber) => {
        if (messageDTO.memberDTO.pfpName != undefined) {
          if (options?.memberService == undefined) {
            reject(new Error("MemberService is undefined"));
          }

          options?.memberService?.getMemberPfpUrl(messageDTO.memberDTO.pfpName)
            .then((pfpUrl: string | undefined) => {
              messageDTO.memberDTO.pfpUrl = pfpUrl;
              subscriber.next(messageDTO);
            })
            .catch((error: Error) => {
              reject(error);
            })
        } else {
          subscriber.next(messageDTO);
          subscriber.complete();
        }
      }).subscribe({
        next: (messageDTO) => {
          if (messageDTO.memberDTO.pfpName == undefined || messageDTO.memberDTO.pfpUrl != undefined) {
            resolve(messageDTO);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
}
