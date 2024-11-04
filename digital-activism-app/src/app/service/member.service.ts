import {HttpClient} from "@angular/common/http";
import {EntityService} from "./entity.service";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {TokenByEmail} from "../model/query/update/token-by-email";
import {TokenByOldToken} from "../model/query/update/token-by-old-token";
import {PasswordByEmail} from "../model/query/update/password-by-email";
import {MemberDto} from "../model/member/member-dto";
import {PfpPathByEmail} from "../model/query/update/pfp-path-by-email";

@Injectable({
  providedIn: 'root'
})
export class MemberService extends EntityService<MemberDto> {

  constructor(http: HttpClient) {
    super(http, "member");
  }

  public findMemberByEmail(email: String): Observable<MemberDto> {
    return this.http.get<MemberDto>(`${this.apiBackendUrl}/${this.entityName}/select-member-by-email/${email}`);
  }

  public updatePasswordByEmail(passwordByEmail: PasswordByEmail): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-password-by-email`, passwordByEmail);
  }

  public updateTokenByEmail(tokenByEmail: TokenByEmail): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-token-by-email`, tokenByEmail);
  }

  public updateTokenByOldToken(tokenByOldToken: TokenByOldToken): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-token-by-old-token`, tokenByOldToken);
  }

  public updatePfpNameByEmail(pfpImgPathByEmail: PfpPathByEmail): Observable<number> {
    return this.http.post<number>(`${this.apiBackendUrl}/${this.entityName}/update-pfp-name-by-email`, pfpImgPathByEmail);
  }
}

export var MIN_PASSWORD_LENGTH: number = 12;
