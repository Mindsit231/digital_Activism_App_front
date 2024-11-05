import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LoginRequest} from '../model/authentication/login-request';
import {MemberDTO} from '../model/member/member-dto';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment.prod';
import {RegisterRequest} from '../model/authentication/register-request';
import {Email} from '../model/misc/email';
import {SendEmailVerificationResponse} from '../model/authentication/send-email-verification-response';
import {SendEmailVerificationRequest} from '../model/authentication/send-email-verification-request';
import {RegisterResponse} from '../model/authentication/register-response';
import {VerifyEmailRequest} from '../model/authentication/verify-email-request';
import {VerifyEmailResponse} from '../model/authentication/verify-email-response';

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

  public sendEmailVerification(sendEmailVerificationRequest: SendEmailVerificationRequest, token: string): Observable<SendEmailVerificationResponse> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.post<SendEmailVerificationResponse>(
      `${this.apiBackendUrl}/authenticated/send-verification-email`,
      sendEmailVerificationRequest,
      {
        headers: headers,
      }
    );
  }

  public verifyEmail(verifyEmailRequest: VerifyEmailRequest, token: String): Observable<VerifyEmailResponse> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.post<VerifyEmailResponse>(
      `${this.apiBackendUrl}/authenticated/verify-email`,
      verifyEmailRequest,
      {
        headers: headers
      }
    );
  }

}
