import {Injectable} from '@angular/core';
import {environment} from '../../environment/environment.prod';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommunityDTO} from '../model/community-dto';
import {FetchEntityLimited} from '../model/misc/fetch-entity-limited';
import {EntityService} from './entity.service';
import {StorageKeys} from '../component/misc/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class CommunityService extends EntityService<CommunityDTO> {

  constructor(protected override http: HttpClient) {
    super(http, 'community');
  }

  public getTableLength(token: string): Observable<number> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<number>(
      `${this.apiBackendUrl}/authenticated/community/get-table-length`,
      {
        headers: headers
      });
  }

  public fetchCommunitiesLimited(fetchEntityLimited: FetchEntityLimited, token: string): Observable<CommunityDTO[]> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<CommunityDTO[]>(
      `${this.apiBackendUrl}/authenticated/community/fetch-communities-limited`,
      fetchEntityLimited,
      {
        headers: headers
      });
  }

  public toggleJoinRequest(communityId: number, token: string): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/community/toggle-join`,
      {
        headers: headers,
        params: {
          communityId: communityId.toString()
        }
      });
  }

  public toggleJoin(communityId: number, token: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.toggleJoinRequest(communityId, token).subscribe({
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


  async getById(communityId: number, token: string): Promise<CommunityDTO | undefined> {
    return new Promise<CommunityDTO | undefined>((resolve, reject) => {
      this.findById(communityId, token).subscribe({
        next: (communityDTO: CommunityDTO) => {
          if(communityDTO != null) {
            console.log(communityDTO)
            resolve(CommunityDTO.fromJson(communityDTO));
          } else {
            resolve(undefined);
          }
        },
        error: (error) => {
          console.error(error);
          resolve(undefined);
        }
      })
    })
  }
}
