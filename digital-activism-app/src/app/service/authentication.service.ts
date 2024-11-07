import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {LoginRequest} from '../model/authentication/login-request';
import {MemberDTO} from '../model/member/member-dto';
import {Observable} from 'rxjs';
import {environment} from '../../environment/environment.prod';
import {RegisterRequest} from '../model/authentication/register-request';
import {SendEmailVerificationResponse} from '../model/authentication/send-email-verification-response';
import {SendEmailVerificationRequest} from '../model/authentication/send-email-verification-request';
import {RegisterResponse} from '../model/authentication/register-response';
import {VerifyEmailRequest} from '../model/authentication/verify-email-request';
import {VerifyEmailResponse} from '../model/authentication/verify-email-response';
import {RouterService} from './router.service';
import {MemberService} from './member/member.service';
import {TokenService} from './token.service';
import {Role} from './guard/role';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  protected apiBackendUrl = environment.apiBackendUrl;
  protected routerService: RouterService = inject(RouterService);

  protected memberService: MemberService = inject(MemberService);
  protected tokenService: TokenService = inject(TokenService);

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

  public isLoggedIn(): Promise<MemberDTO> {
    return new Promise<MemberDTO>((resolve, reject) => {
      this.loginByToken(this.tokenService.getUserToken()).subscribe({
        next: (memberDTO: MemberDTO) => {
          if (memberDTO != null) {
            this.tokenService.setUserToken(memberDTO.token!);
            resolve(memberDTO);
          } else {
            reject(new Error('MemberDTO is null'));
          }

        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        }
      });
    })
  }

  async canActivateRole(roles: Role[]): Promise<boolean> {
    return await this.isLoggedIn().then(
      (memberDTO: MemberDTO) => {
        if (memberDTO != null) {
          for (let role of roles) {
            if (memberDTO.role == role.role) {
              console.log("Passed role check");
              return true;
            }
          }
        }
        console.log("Failed role check");
        return false;
      }
    ).catch((error) => {
      console.log(error);
      console.log("Failed role check");
      return false;
    });
  }

  logoutOnClick() {
    this.tokenService.deleteUserToken();
    this.routerService.routeToHome().then(() => {
      window.location.reload();
    });
  }
}
