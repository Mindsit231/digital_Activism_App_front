import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {LoginRequest} from '../model/authentication/login-request';
import {MemberDto} from '../model/member/member-dto';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment.prod';
import {RegisterRequest} from '../model/authentication/register-request';
import {Email} from '../model/misc/email';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  protected apiBackendUrl = environment.apiBackendUrl;

  constructor(protected http: HttpClient) {
  }

  public verifyLogin(loginRequest: LoginRequest): Observable<MemberDto> {
    return this.http.post<MemberDto>(`${this.apiBackendUrl}/public/login`, loginRequest);
  }

  public register(registerRequest: RegisterRequest): Observable<MemberDto> {
    return this.http.post<MemberDto>(`${this.apiBackendUrl}/public/register`, registerRequest);
  }

  public loginByToken(token: string): Observable<MemberDto> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<MemberDto>(`${this.apiBackendUrl}/authenticated/login-by-token`, {headers});
  }

  public verifyEmail(token: String): Observable<number> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<number>(`${this.apiBackendUrl}/authenticated/verify-email`, {headers});
  }

  public sendVerificationEmail(token: string, email: string): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    const params: HttpParams = new HttpParams().set('email', email);

    return this.http.get<boolean>(`${this.apiBackendUrl}/authenticated/send-verification-email`, {
      headers: headers,
      params: params
    });
  }
}
