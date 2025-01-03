import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommunityDTO} from '../model/community/community-dto';
import {FetchEntityLimited} from '../model/misc/fetch-entity-limited';
import {EntityService} from './entity.service';
import {FileService} from './misc/file.service';
import {TokenService} from './token.service';
import {CommunityRequest} from '../model/community/community-request';

@Injectable({
  providedIn: 'root'
})
export class CommunityService extends EntityService<CommunityDTO> {

  constructor(protected override http: HttpClient,
              protected override fileService: FileService,
              protected override tokenService: TokenService) {
    super(http, 'community');
  }

  public getTableLength(searchValue: string): Observable<number> {
    return this.http.get<number>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/get-table-length`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          searchValue: searchValue
        }
      });
  }

  public fetchCommunityDTOSLimited(fetchEntityLimited: FetchEntityLimited): Promise<CommunityDTO[]> {
    let communityDTOObss = this.http.post<CommunityDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-communities-limited`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      });

    return this.initializeDTOObss(communityDTOObss, this.initializeCommunityDTO);
  }

  public fetchCommunityDTOSLimitedByMemberId(fetchEntityLimited: FetchEntityLimited): Promise<CommunityDTO[]> {
    let communityDTOObss = this.http.post<CommunityDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-communities-limited-by-member-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      });

    return this.initializeDTOObss(communityDTOObss, this.initializeCommunityDTO);
  }

  public fetchCommunitiesCountByMemberId(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.http.get<number>(
        `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-communities-count-by-member-id`,
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

  public toggleJoinRequest(communityId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/toggle-join`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          communityId: communityId.toString()
        }
      });
  }

  public findCommunityDTOById(communityId: number): Promise<CommunityDTO> {
    let communityDTOOBs = this.http.get<CommunityDTO>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/find-community-dto-by-id`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          communityId: communityId.toString()
        }
      })

    return this.initializeDTOObs(communityDTOOBs, this.initializeCommunityDTO);
  }

  public toggleJoin(communityId: number): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.toggleJoinRequest(communityId).subscribe({
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

  public getCommunityById(communityId: number): Promise<CommunityDTO> {
    return new Promise<CommunityDTO>((resolve, reject) => {
      this.findCommunityDTOById(communityId).then(
        (communityDTO: CommunityDTO) => {
          if (communityDTO != null) {
            resolve(communityDTO);
          } else {
            reject(new Error("CommunityDTO is null"));
          }
        },
        (error: Error) => {
          reject(error);
        }
      )
    })
  }

  public initializeCommunityDTO(communityDTOJson: CommunityDTO,
                                options?: {
                                  fileService?: FileService,
                                  tokenService?: TokenService,
                                  entityName?: string
                                }): Promise<CommunityDTO> {
    return new Promise<CommunityDTO>((resolve, reject) => {
      if (communityDTOJson == undefined) {
        reject(new Error("CommunityDTOJson is undefined"));
      }

      let communityDTO = CommunityDTO.fromJson(communityDTOJson);

      new Observable<CommunityDTO>((subscriber) => {
        if (communityDTO != undefined) {
          if (communityDTO.logoName != undefined && communityDTO.logoName.length > 0) {
            if (options?.fileService == undefined) {
              reject(new Error("FileService is undefined"));
            }
            options?.fileService?.downloadFile(communityDTO.logoName, options?.entityName!)
              .then((logoUrl: string) => {
                communityDTO.logoUrl = logoUrl;
              })
              .catch((error: Error) => {
                console.log(error)
                communityDTO.logoUrl = "assets/placeholder/placeholder-logo.jpg";
              })
              .finally(() => {
                subscriber.next(communityDTO);
              })
          } else {
            communityDTO.logoUrl = "assets/placeholder/placeholder-logo.jpg";
            subscriber.next(communityDTO);
          }

          if (communityDTO.bannerName != undefined && communityDTO.bannerName.length > 0) {
            if (options?.fileService == undefined) {
              reject(new Error("FileService is undefined"));
            }
            options?.fileService?.downloadFile(communityDTO.bannerName, options?.entityName!)
              .then((bannerUrl: string) => {
                communityDTO.bannerUrl = bannerUrl;
              })
              .catch((error: Error) => {
                communityDTO.bannerUrl = "assets/placeholder/placeholder-banner.jpg";
              })
              .finally(() => {
                subscriber.next(communityDTO);
              })
          } else {
            communityDTO.bannerUrl = "assets/placeholder/placeholder-banner.jpg";
            subscriber.next(communityDTO);
          }
        } else {
          subscriber.error(new Error("CommunityDTO is undefined"));
        }
      })
        .subscribe({
          next: (communityDTO: CommunityDTO) => {
            if (communityDTO.bannerUrl != undefined && communityDTO.logoUrl != undefined) {
              resolve(communityDTO);
            }
          },
          error: (error: Error) => {
            reject(error);
          }
        })
    })
  }

  public addCommunity(communityRequest: CommunityRequest): Promise<CommunityDTO> {
    return new Promise<CommunityDTO>((resolve, reject) => {
      this.http.post<CommunityDTO>(
        `${this.apiBackendUrl}/authenticated/${this.entityName}/add`,
        communityRequest,
        {
          headers: this.tokenService.getAuthHeaders()
        }
      ).subscribe({
        next: (communityDTO: CommunityDTO) => {
          this.initializeCommunityDTO(communityDTO, {
            fileService: this.fileService,
            tokenService: this.tokenService,
            entityName: this.entityName
          })
            .then((communityDTO: CommunityDTO) => {
              resolve(communityDTO);
            })
            .catch((error: Error) => {
              reject(error);
            })
        },
        error: (error) => {
          reject(error);
        }
      })
    })

  }
}
