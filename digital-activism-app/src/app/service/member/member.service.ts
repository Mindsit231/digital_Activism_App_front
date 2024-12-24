import {HttpClient} from "@angular/common/http";
import {EntityService} from "../entity.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {MemberDTO} from "../../model/member/member-dto";
import {PfpNameByEmail} from "../../model/query/update/pfp-name-by-email";
import {TagDTO} from '../../model/tag/tag-dto';
import {UpdateResponse} from '../../model/member/update-response';
import {UpdateRequest} from '../../model/member/update-request';
import {CurrentMemberService} from './current-member.service';
import {TokenService} from '../token.service';
import {FileService} from '../misc/file.service';
import {MEMBER_ENTITY} from '../entity-names';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends EntityService<MemberDTO> {

  constructor(http: HttpClient,
              protected override tokenService: TokenService,
              protected override fileService: FileService,
              protected currentMemberService: CurrentMemberService) {
    super(http, MEMBER_ENTITY);
  }

  public updatePfpNameByEmail(pfpImgPathByEmail: PfpNameByEmail): Observable<number> {
    return this.http.post<number>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/update-pfp-name-by-email`,
      pfpImgPathByEmail,
      {
        headers: this.tokenService.getAuthHeaders()
      });
  }

  public proposeNewTag(tag: string): Observable<TagDTO> {
    return this.http.post<TagDTO>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/propose-new-tag`,
      tag,
      {
        headers: this.tokenService.getAuthHeaders()
      });
  }

  public fetchTagsByToken(): Observable<TagDTO[]> {
    return this.http.post<TagDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-tags-by-token`,
      null,
      {
        headers: this.tokenService.getAuthHeaders()
      });
  }

  public deleteTagByToken(tag: TagDTO): Observable<boolean> {
    return this.http.post<boolean>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/delete-tag-by-token`,
      tag,
      {
        headers: this.tokenService.getAuthHeaders()
      });
  }

  public update(updateRequest: UpdateRequest): Observable<UpdateResponse> {
    return this.http.post<UpdateResponse>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/update`,
      updateRequest,
      {
        headers: this.tokenService.getAuthHeaders()
      });
  }

  public fetchMembersLimitedByCommunityId(fetchEntityLimited: FetchEntityLimited): Promise<MemberDTO[]> {
    let memberDTOObs = this.http.post<MemberDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-members-limited-by-community-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders(),
      });

    return this.initializeDTOObss(memberDTOObs, this.initializeMemberDTO);
  }

  public fetchMembersLimitedByCampaignId(fetchEntityLimited: FetchEntityLimited): Promise<MemberDTO[]> {
    let memberDTOObs = this.http.post<MemberDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-members-limited-by-campaign-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders(),
      });

    return this.initializeDTOObss(memberDTOObs, this.initializeMemberDTO);
  }

  public initializeMemberDTO(memberDTOJson: MemberDTO,
                             options?: {
                               memberService?: MemberService
                             }): Promise<MemberDTO> {
    return new Promise<MemberDTO>((resolve, reject) => {
      if (memberDTOJson == undefined) {
        reject(new Error("MemberDTOJson is undefined"));
      }
      let memberDTO: MemberDTO = MemberDTO.fromJson(memberDTOJson);

      new Observable<MemberDTO>((subscriber) => {
        if (memberDTO != undefined) {
          if (options?.memberService == undefined) {
            reject(new Error("MemberService is undefined"));
          }
          options?.memberService?.getMemberPfpUrl(memberDTO.pfpName)
            .then((pfpUrl: string | undefined) => {
              memberDTO.pfpUrl = pfpUrl;
              subscriber.next(memberDTO);
            })
            .catch((error: Error) => {
              subscriber.next(memberDTO);
            })
        } else {
          subscriber.error(new Error("MemberDTO is undefined"));
        }
      })
        .subscribe({
          next: (memberDTO: MemberDTO) => {
            if (memberDTO.pfpName == undefined || memberDTO.pfpUrl != undefined) {
            }
            console.log(memberDTO)
            resolve(memberDTO);
          },
          error: (error: Error) => {
            reject(error);
          }
        })
    })
  }

  // public initializeMember(memberDTOObs: Observable<MemberDTO>): Promise<MemberDTO> {
  //   return new Promise<MemberDTO>((resolve, reject) => {
  //     memberDTOObs.subscribe({
  //       next: (jsonMemberDTO: MemberDTO) => {
  //         if (jsonMemberDTO != null) {
  //           let memberDTO: MemberDTO = MemberDTO.fromJson(jsonMemberDTO);
  //           this.getMemberPfpUrl(memberDTO.pfpName)
  //             .then((pfpUrl: string) => {
  //               memberDTO.pfpUrl = pfpUrl;
  //               resolve(memberDTO);
  //             })
  //             .catch((error: Error) => {
  //               reject(error);
  //             })
  //           resolve(memberDTO)
  //         } else {
  //           reject(new Error("MemberDTO is null"));
  //         }
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         reject(error);
  //       }
  //     })
  //   })
  // }

  public getMemberPfpUrl(pfpName: string | undefined): Promise<string | undefined> {
    return new Promise<string| undefined>((resolve, reject) => {
      if (pfpName != undefined) {
        this.fileService.downloadFile(pfpName, this.entityName)
          .then((pfpUrl: string) => {
            resolve(pfpUrl);
          }).catch((error: Error) => {
          reject(error);
        })
      } else {
        resolve(undefined);
      }
    })
  }

}
