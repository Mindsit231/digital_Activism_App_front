import {Observable} from "rxjs";
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environment/environment.prod";
import {Injectable} from "@angular/core";
import {CommunityDTO} from '../model/community-dto';

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<T> {
  protected apiBackendUrl = environment.apiBackendUrl;
  public readonly entityName: string;

  protected constructor(protected http: HttpClient, entityName: string) {
    this.entityName = entityName;
  }

  public findById(communityId: number, token: string): Observable<T> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<T>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/find-community-dto-by-id`,
      {
        headers: headers,
        params: {
          communityId: communityId.toString()
        }
      })
  }
}

