import {Component, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {AuthenticationComponent} from "../authentication-component";
import {FormsModule} from "@angular/forms";
import {RECAPTCHA_SETTINGS, RecaptchaComponent, RecaptchaModule} from "ng-recaptcha-2";
import {environment} from "../../../../environment/environment.prod";
import {MemberService} from "../../../service/member/member.service";
import {LogoComponent} from "../../logo/logo.component";
import {CookieService} from 'ngx-cookie-service';
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {RouterService} from '../../../service/router.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {RecoverPasswordRequest} from '../../../model/authentication/password-recovery/recover-password-request';
import {passwordResetRoute} from '../../../app.routes';
import {RecoverPasswordResponse} from '../../../model/authentication/password-recovery/recover-password-response';
import {HttpErrorResponse} from '@angular/common/http';
import {ACTION_FAILURE, ACTION_NULL, ACTION_SUCCESS, ActionStatus} from '../../misc/action-status';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    NgIf,
    RecaptchaModule,
    FormsModule, LogoComponent, FooterComponent, NgxResizeObserverModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS, useValue: {
        siteKey: environment.siteKey
      }
    }
  ],
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css', '../auth.styles.scss']
})
export class PasswordRecoveryComponent extends AuthenticationComponent {
  override getRecaptchaRef(): RecaptchaComponent {
    return this.captchaRef;
  }

  protected readonly ACTION_SUCCESS = ACTION_SUCCESS;
  protected readonly ACTION_NULL = ACTION_NULL;
  protected readonly ACTION_FAILURE = ACTION_FAILURE;

  // Form fields
  emailInput: string = "";

  // Logic Fields
  isEmailSent: ActionStatus = ACTION_NULL;

  recoverPasswordResponse: RecoverPasswordResponse = new RecoverPasswordResponse();

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent

  constructor(protected memberService: MemberService,
              protected cookieService: CookieService,
              protected authenticationService: AuthenticationService,
              protected override reCaptchaService: ReCaptchaService,
              protected routerService: RouterService) {
    super();
  }

  override onSubmit() {
    new Promise<boolean>((resolve, reject) => {
      this.isFormValid().then((isFormValid) => {
        if (isFormValid) {
          this.formValidated = true;
          // this.memberService.findMemberByEmail(this.emailInput).subscribe({
          //   next: (jsonMember: MemberDto) => {
          //     if (jsonMember != null) {
          //       this.isEmailExist = true;
          //       let newToken = generateRandomToken();
          //       this.emailService.sendEmail(Email.recoveryEmail(jsonMember.email, newToken)).subscribe({
          //           next: (success: boolean) => {
          //             if (success) {
          //               this.resetTokenByEmail(jsonMember.email, newToken).then((success) => {
          //                 resolve(success);
          //               });
          //               console.log('Email sent');
          //             } else {
          //               console.error('Email not sent');
          //               resolve(false);
          //             }
          //           },
          //           error: (error: HttpErrorResponse) => {
          //             console.error("HTTP ERROR: Email not sent");
          //             resolve(false);
          //           }
          //         }
          //       )
          //     } else {
          //       console.log('Email does not exist');
          //       resolve(false);
          //     }
          //     this.isEmailChecked = true;
          //   },
          //   error: (error: HttpErrorResponse) => {
          //     console.error("HTTP ERROR: Email does not exist");
          //     resolve(false);
          //   }
          // });
          let recoverPasswordRequest = new RecoverPasswordRequest(this.emailInput, passwordResetRoute);
          this.authenticationService.recoverPassword(recoverPasswordRequest).subscribe({
            next: (recoverPasswordResponse: RecoverPasswordResponse) => {
              this.recoverPasswordResponse = recoverPasswordResponse;
              if (recoverPasswordResponse.success) {
                console.log('Email sent');
                resolve(true);
              } else {
                console.error('Email not sent');
                resolve(false);
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error("HTTP ERROR: Email does not exist");
              resolve(false);
            }
          })
        } else {
          console.log('Form not valid');
          resolve(false);
        }
      });
    }).then(success => {
      super.onSubmit();
      this.formValidated = false;
      this.isEmailSent = success ? ACTION_SUCCESS : ACTION_FAILURE;

      if (!success) this.resetCaptcha();
    });
  }

  override async isFormValid(): Promise<boolean> {
    if (this.isEmailProper(this.emailInput)) {
      return await this.checkCaptcha();
    } else {
      return Promise.resolve(false);
    }
  }

  isEmailInvalid(): boolean {
    return !(this.isEmailProper(this.emailInput) && this.emailInput.length > 0) && this.isSubmitted;
  }


}
