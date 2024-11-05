import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {LoginRequest} from '../model/authentication/login-request';
import {MemberDTO} from '../model/member/member-dto';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment.prod';
import {RegisterRequest} from '../model/authentication/register-request';
import {Email} from '../model/misc/email';
import {EmailVerificationResponse} from '../model/authentication/email-verification-response';
import {EmailVerificationRequest} from '../model/authentication/email-verification-request';
import {RegisterResponse} from '../model/authentication/register-response';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  protected apiBackendUrl = environment.apiBackendUrl;
  protected EMAIL_HEADER = 'Email';

  constructor(protected http: HttpClient) {
  }

  public verifyLogin(loginRequest: LoginRequest): Observable<MemberDTO> {
    return this.http.post<MemberDTO>(`${this.apiBackendUrl}/public/login`, loginRequest);
  }

  public register(registerRequest: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiBackendUrl}/public/register`, registerRequest);
  }

  public loginByToken(token: string): Observable<MemberDTO> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<MemberDTO>(
      `${this.apiBackendUrl}/authenticated/login-by-token`,
      null,
      {
        headers: headers
      }
    );
  }

  public verifyEmail(token: String): Observable<number> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<number>(
      `${this.apiBackendUrl}/authenticated/verify-email`,
      null,
      {
        headers: headers
      }
    );
  }

  public sendVerificationEmail(verificationEmailRequest: EmailVerificationRequest): Observable<EmailVerificationResponse> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${verificationEmailRequest.token}`});
    const params: HttpParams = new HttpParams().set(this.EMAIL_HEADER, verificationEmailRequest.email);

    return this.http.post<EmailVerificationResponse>(
      `${this.apiBackendUrl}/authenticated/send-verification-email`,
      null,
      {
        headers: headers,
        params: params
      }
    );
  }
}
