import {inject, Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {StorageKeys} from '../component/misc/storage-keys';
import {MemberDTO} from '../model/member/member-dto';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  protected cookieService: CookieService = inject(CookieService);


  constructor() {
  }

  setUserToken(token: string): void {
    this.cookieService.set(StorageKeys.USER_TOKEN, token, 1, '/');
  }

  getUserToken(): string {
    return this.cookieService.get(StorageKeys.USER_TOKEN);
  }

  hasUserToken(): boolean {
    return this.cookieService.check(StorageKeys.USER_TOKEN);
  }

  deleteUserToken(): void {
    this.cookieService.delete(StorageKeys.USER_TOKEN, '/');
  }

  public extractMemberFromToken(token: string): MemberDTO {
    let decoded: MemberDTO = jwtDecode(token);
    return MemberDTO.fromJson(decoded);
  }

}
