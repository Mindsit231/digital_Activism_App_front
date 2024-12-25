import {inject, Injectable} from '@angular/core';
import {SendEmailVerificationRequest} from '../model/authentication/verify-email/send-email-verification-request';
import {SendEmailVerificationResponse} from '../model/authentication/verify-email/send-email-verification-response';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {InternalObjectService} from './misc/internal-object.service';
import {RouterService} from './router.service';
import {verifyEmailRoute} from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  private authenticationService: AuthenticationService = inject(AuthenticationService);
  private routerService: RouterService = inject(RouterService);
  private internalObjectService: InternalObjectService<{
    email: string
    token: string
  }> = inject(InternalObjectService);

  constructor() {
  }

  sendEmailVerification(email: string, token: string, routing: boolean = true): Promise<SendEmailVerificationResponse> {
    let sendEmailVerificationRequest = new SendEmailVerificationRequest(email.toLowerCase());

    return new Promise<SendEmailVerificationResponse>((resolve, reject) => {
      this.authenticationService.sendEmailVerification(sendEmailVerificationRequest, token).subscribe({
        next: (sendEmailVerificationResponse: SendEmailVerificationResponse) => {
          if (sendEmailVerificationResponse != null && sendEmailVerificationResponse.errors.length == 0) {
            this.internalObjectService.setObject({
              email: email,
              token: token
            });
            if(routing) this.routerService.routeToVerifyEmail().then();
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
