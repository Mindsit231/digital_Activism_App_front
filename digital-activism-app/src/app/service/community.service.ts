import {Injectable} from '@angular/core';
import {environment} from '../../environment/environment.prod';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CommunityDTO} from '../model/community-d-t-o';
import {FetchEntityLimited} from '../model/misc/fetch-entity-limited';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  protected apiBackendUrl = environment.apiBackendUrl;

  constructor(protected http: HttpClient) {
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
}
