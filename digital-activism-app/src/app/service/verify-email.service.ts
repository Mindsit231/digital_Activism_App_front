import {inject, Injectable} from '@angular/core';
import {SendEmailVerificationRequest} from '../model/authentication/send-email-verification-request';
import {SendEmailVerificationResponse} from '../model/authentication/send-email-verification-response';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {MemberDTO} from '../model/member/member-dto';
import {InternalObjectService} from './misc/internal-object.service';
import {RouterService} from './router.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private routerService: RouterService = inject(RouterService);
  private internalObjectService: InternalObjectService<{
    verificationCodeHash: string,
    email: string
    token: string
  }> = inject(InternalObjectService);

  constructor() {
  }

  sendEmailVerification(email: string, token: string): Promise<SendEmailVerificationResponse> {
    let sendEmailVerificationRequest = new SendEmailVerificationRequest(email.toLowerCase());

    return new Promise<SendEmailVerificationResponse>((resolve, reject) => {
      this.authenticationService.sendEmailVerification(sendEmailVerificationRequest, token).subscribe({
        next: (sendEmailVerificationResponse: SendEmailVerificationResponse) => {
          if (sendEmailVerificationResponse != null && sendEmailVerificationResponse.errors.length == 0) {
            this.internalObjectService.setObject({
              verificationCodeHash: sendEmailVerificationResponse.verificationCodeHash,
              email: email,
              token: token
            });
            console.log("here")
            this.routerService.routeTo('/verify-email');
            resolve(sendEmailVerificationResponse);
          } else {
            reject(sendEmailVerificationResponse.errors);
          }
        }, error: (error: HttpErrorResponse) => {
          reject("Error in sending email: " + error);
        }
      })
    });
  }

}
