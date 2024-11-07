import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {FormComponent} from "../../misc/form-component";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LogoComponent} from "../../logo/logo.component";
import {CookieService} from "ngx-cookie-service";
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {MemberService} from '../../../service/member/member.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {VerifyEmailResponse} from '../../../model/authentication/verify-email/verify-email-response';
import {VerifyEmailRequest} from '../../../model/authentication/verify-email/verify-email-request';
import {RouterService} from '../../../service/router.service';
import {VerifyEmailService} from '../../../service/verify-email.service';
import {SendEmailVerificationResponse} from '../../../model/authentication/verify-email/send-email-verification-response';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ACTION_FAILURE, ACTION_NULL, ACTION_SUCCESS, ActionStatus} from '../../misc/action-status';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    LogoComponent,
    FooterComponent,
    NgxResizeObserverModule,
    NgForOf,
    MatProgressBar
  ],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css', '../auth.styles.scss', '../../main/main.component.scss']
})
export class VerifyEmailComponent extends FormComponent implements OnInit, OnDestroy {
  protected readonly ACTION_SUCCESS = ACTION_SUCCESS;
  protected readonly ACTION_FAILURE = ACTION_FAILURE;
  protected readonly ACTION_NULL = ACTION_NULL;

  // Form Fields
  verificationCodeInput: string = "";

  // Logic Fields
  isCodeValid: ActionStatus = ACTION_NULL;

  verifyEmailResponse: VerifyEmailResponse = new VerifyEmailResponse([], false);
  sendEmailVerificationResponse: SendEmailVerificationResponse = new SendEmailVerificationResponse([]);

  TIME_LEFT: number = 5;

  timeLeft: number = this.TIME_LEFT;
  interval: any;
  allowNewEmailButton: boolean = false;
  emailResent: ActionStatus = ACTION_NULL;

  constructor(protected memberService: MemberService,
              protected cookieService: CookieService,
              protected authenticationService: AuthenticationService,
              protected verifyEmailService: VerifyEmailService,
              protected internalObjectService: InternalObjectService<{
                email: string
                token: string
              }>,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    this.startTimer();
    console.log(this.internalObjectService.getObject());
  }

  override isFormValid(): Promise<boolean> {
    return Promise.resolve(this.verificationCodeInput.length > 0);
  }

  override onSubmit() {
    this.resetErrors();

    new Promise<boolean>((resolve, reject) => {
      this.isFormValid().then((isFormValid) => {
        let inputObject = this.internalObjectService.getObject();
        if (isFormValid && inputObject != null) {
          this.formValidated = true;

          let verifyEmailRequest = new VerifyEmailRequest(
            inputObject.email,
            this.verificationCodeInput
          );
          this.authenticationService.verifyEmail(verifyEmailRequest, inputObject.token).subscribe({
            next: (verifyEmailResponse: VerifyEmailResponse) => {
              this.verifyEmailResponse = verifyEmailResponse;

              if (verifyEmailResponse.success) {
                console.log('Email is verified');
                resolve(true);
              } else {
                console.log('Email is not verified');
                resolve(false);
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error(error);
              resolve(false);
            }
          });
        } else {
          console.error('Form is invalid');
          resolve(false);
        }
      });


    }).then((success) => {
      super.onSubmit();
      this.formValidated = false;

      if(success) {
        this.isCodeValid = ACTION_SUCCESS;
      } else {
        this.onValidateEmailFail();
      }
    });
  }

  private onValidateEmailFail() {
    this.isCodeValid = ACTION_FAILURE;
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
      if(this.timeLeft == 0) {
        this.allowNewEmailButton = true;
      }
    }, 1000); // 1000 ms = 1 second
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  getSecondText() {
    return "second" + (this.timeLeft > 1 ? "s" : "");
  }

  getWaitText() {
    return (this.timeLeft > 0 ? "in " + this.timeLeft + " " + this.getSecondText() : "");
  }

  sendNewEmail() {
    this.resetValues();
    this.resetErrors();

    let inputObject = this.internalObjectService.getObject();
    if (inputObject != null && inputObject.email != null && inputObject.token != null) {
      this.verifyEmailService.sendEmailVerification(inputObject.email, inputObject.token)
        .then(sendEmailVerificationResponse => {
          this.sendEmailVerificationResponse = sendEmailVerificationResponse;
        }).finally(() => {
        if (this.sendEmailVerificationResponse.errors.length == 0) {
          this.onEmailResentSuccess();
        } else {
          this.onEmailResentFail();
        }
      })
    } else {
      console.error("Internal object is null");
      this.onEmailResentFail();
    }
  }

  private resetValues() {
    this.emailResent = ACTION_NULL;
    this.allowNewEmailButton = false;
    this.formValidated = true;
  }

  private resetErrors() {
    this.verifyEmailResponse.errors = [];
    this.sendEmailVerificationResponse.errors = [];
  }

  private onEmailResentFail() {
    this.emailResent = ACTION_FAILURE;
    this.allowNewEmailButton = true;
    clearInterval(this.interval);
    this.formValidated = false;
  }

  private onEmailResentSuccess() {
    this.emailResent = ACTION_SUCCESS;
    this.timeLeft = this.TIME_LEFT;
    this.startTimer();
    this.formValidated = false;
  }
}
