import {HttpClient, HttpHeaders} from "@angular/common/http";
import {EntityService} from "../entity.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {MemberDTO} from "../../model/member/member-dto";
import {PfpNameByEmail} from "../../model/query/update/pfp-name-by-email";
import {Tag} from '../../model/tag';
import {UpdateResponse} from '../../model/member/update-response';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends EntityService<MemberDTO> {

  constructor(http: HttpClient) {
    super(http, "member");
  }

  public updatePfpNameByEmail(pfpImgPathByEmail: PfpNameByEmail, token: string): Observable<number> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<number>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/update-pfp-name-by-email`,
      pfpImgPathByEmail,
      {
        headers: headers
      });
  }

  public proposeNewTag(tag: string, token: string): Observable<Tag> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<Tag>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/propose-new-tag`,
      tag,
      {
        headers: headers
      });
  }

  public fetchTagsByToken(token: string): Observable<Tag[]> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.post<Tag[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-tags-by-token`,
      null,
      {
        headers: headers
      });
  }

  public deleteTagByToken(tag: Tag, token: string): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.post<boolean>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/delete-tag-by-token`,
      tag,
      {
        headers: headers
      });
  }

  public update(memberDTO: MemberDTO, token: string): Observable<UpdateResponse> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<UpdateResponse>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/update`,
      memberDTO,
      {
        headers: headers
      });
  }

}
