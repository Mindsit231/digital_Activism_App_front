import {Injectable} from '@angular/core';
import {CampaignDTO} from '../model/campaign/campaign-dto';
import {EntityService} from './entity.service';
import {HttpClient} from '@angular/common/http';
import {CAMPAIGN_ENTITY} from './entity-names';
import {Observable} from 'rxjs';
import {FetchEntityLimited} from '../model/misc/fetch-entity-limited';
import {MemberService} from './member/member.service';
import {CampaignRequest} from '../model/campaign/campaign-request';
import {TokenService} from './token.service';
import {CommunityDTO} from '../model/community/community-dto';

@Injectable({
  providedIn: 'root'
})
export class CampaignService extends EntityService<CampaignDTO> {

  constructor(http: HttpClient,
              protected override tokenService: TokenService,
              public override memberService: MemberService) {
    super(http, CAMPAIGN_ENTITY);
  }

  public fetchCampaignDTOSLimitedByCommunityId(fetchEntityLimited: FetchEntityLimited): Promise<CampaignDTO[]> {
    let postDTOObs: Observable<CampaignDTO[]> = this.http.post<CampaignDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-limited-by-community-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      }
    );

    return this.initializeDTOObss(postDTOObs, this.initializeCampaignDTO);
  }

  public getTableLength(communityId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiBackendUrl}/authenticated/campaign/get-table-length-by-community-id`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          communityId: communityId.toString()
        }
      });
  }

  public fetchCampaignDTOSLimitedByMemberId(fetchEntityLimited: FetchEntityLimited): Promise<CampaignDTO[]> {
    let communityDTOObss = this.http.post<CampaignDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-campaigns-limited-by-member-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      });

    return this.initializeDTOObss(communityDTOObss, this.initializeCampaignDTO);
  }

  public fetchCampaignsCountByMemberId(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.http.get<number>(
        `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-campaigns-count-by-member-id`,
        {
          headers: this.tokenService.getAuthHeaders(),
        })
        .subscribe({
          next: (response: number) => {
            resolve(response);
          },
          error: (error) => {
            console.error(error);
            reject(error);
          }
        });
    })
  }

  addCampaign(campaignRequest: CampaignRequest): Promise<CampaignDTO> {
    return new Promise<CampaignDTO>((resolve, reject) => {
      this.http.post<CampaignDTO>(
        `${this.apiBackendUrl}/authenticated/community-admin/campaign/add`,
        campaignRequest,
        {
          headers: this.tokenService.getAuthHeaders()
        }
      ).subscribe({
        next: (campaignDTO: CampaignDTO) => {
          this.initializeCampaignDTO(campaignDTO, {
            memberService: this.memberService
          })
            .then((campaignDTO: CampaignDTO) => {
              resolve(campaignDTO);
            })
            .catch((error: Error) => {
              reject(error);
            })
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    })

  }

  public toggleParticipateRequest(campaignId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/campaign/toggle-participate`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          campaignId: campaignId.toString()
        }
      });
  }

  public toggleParticipate(campaignId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.toggleParticipateRequest(campaignId).subscribe({
        next: (response: boolean) => {
          resolve(response);
        },
        error: (error) => {
          console.error(error);
          resolve(false);
        }
      });
    })
  }


  public getCampaignByIdAndCommunityId(campaignId: number, communityId: number): Promise<CampaignDTO> {
    return new Promise<CampaignDTO>((resolve, reject) => {
      this.findCampaignDTOById(campaignId, communityId).then(
        (campaignDTO: CampaignDTO) => {
          if (campaignDTO != null) {
            resolve(campaignDTO);
          } else {
            reject(new Error("CampaignDTO is null"));
          }
        },
        (error: Error) => {
          reject(error);
        }
      )
    })
  }

  private findCampaignDTOById(campaignId: number, communityId: number): Promise<CampaignDTO> {
    let campaignDTOOBs = this.http.get<CampaignDTO>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/find-campaign-dto-by-id`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          campaignId: campaignId.toString(),
          communityId: communityId.toString()
        }
      })

    return this.initializeDTOObs(campaignDTOOBs, this.initializeCampaignDTO);
  }

  private initializeCampaignDTO(campaignDTOJson: CampaignDTO,
                                options?: {
                                  memberService?: MemberService
                                }): Promise<CampaignDTO> {
    return new Promise<CampaignDTO>((resolve, reject) => {
      if (campaignDTOJson == undefined) {
        reject(new Error("CampaignDTOJson is undefined"));
      }

      let campaignDTO: CampaignDTO = CampaignDTO.fromJson(campaignDTOJson);

      new Observable<CampaignDTO>((subscriber) => {
        if (campaignDTO.memberDTO.pfpName != undefined) {
          if (options?.memberService == undefined) {
            reject(new Error("MemberService is undefined"));
          }
          options?.memberService?.getMemberPfpUrl(campaignDTO.memberDTO.pfpName)
            .then((pfpUrl: string | undefined) => {
              campaignDTO.memberDTO.pfpUrl = pfpUrl;
              subscriber.next(campaignDTO);
            })
            .catch((error: Error) => {
              reject(error);
            })
        } else {
          subscriber.next(campaignDTO);
        }
      }).subscribe({
        next: (campaignDTO: CampaignDTO) => {
          if (campaignDTO.memberDTO.pfpName == undefined || campaignDTO.memberDTO.pfpUrl != undefined) {
            resolve(campaignDTO);
          }
        },
        error: (error: Error) => {
          reject(error);
        }
      });

    })
  }
}
