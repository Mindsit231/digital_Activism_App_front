import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaComponent, RecaptchaModule} from "ng-recaptcha-2";
import {FormsModule} from "@angular/forms";
import {LogoComponent} from "../../logo/logo.component";
import {FooterComponent} from "../../footer/footer.component";
import {MemberService} from "../../../service/member/member.service";
import {CurrentMemberService} from "../../../service/member/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../../../environment/environment.prod";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationComponent} from "../authentication-component";
import {AuthenticationService} from '../../../service/authentication.service';
import {NgxResizeObserverModule} from 'ngx-resize-observer';
import {HttpErrorResponse} from '@angular/common/http';
import {RegisterRequest} from '../../../model/authentication/register/register-request';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';
import {RegisterResponse} from '../../../model/authentication/register/register-response';
import {
  SendEmailVerificationResponse
} from '../../../model/authentication/verify-email/send-email-verification-response';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';
import {RouterService} from '../../../service/router.service';
import {VerifyEmailService} from '../../../service/verify-email.service';
import {ErrorLists} from '../../../model/authentication/error-lists';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    RecaptchaModule,
    FormsModule,
    LogoComponent,
    FooterComponent,
    NgxResizeObserverModule,
    NgForOf,
    MatProgressBar,
    MatProgressBarModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS, useValue: {
        siteKey: environment.siteKey
      }
    }
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends AuthenticationComponent implements OnInit {
  override getRecaptchaRef(): RecaptchaComponent {
    return this.captchaRef;
  }

  faXmark = faXmark;

  // Form fields
  emailInput: string = "";
  usernameInput: string = "";
  passwordInput: string = "";
  confirmPasswordInput: string = "";

  registerResponse: RegisterResponse = new RegisterResponse(new ErrorLists([]), "");
  emailVerificationResponse = new SendEmailVerificationResponse([]);

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent

  constructor(protected override reCaptchaService: ReCaptchaService,
              protected memberService: MemberService,
              protected currentMemberService: CurrentMemberService,
              protected authenticationService: AuthenticationService,
              protected cookieService: CookieService,
              protected routerService: RouterService,
              protected verifyEmailService: VerifyEmailService) {
    super();
  }

  ngOnInit(): void {
  }

  override onSubmit() {
    this.emailVerificationResponse = new SendEmailVerificationResponse([]);

    new Promise<boolean>((resolve, reject) => {
      this.isFormValid().then((isFormValid) => {
        if (isFormValid) {
          this.formValidated = true;
          console.log("Form is valid")
          let registerRequest = new RegisterRequest(this.usernameInput, this.emailInput, this.passwordInput);
          this.authenticationService.register(registerRequest).subscribe({
            next: (registerResponse: RegisterResponse) => {
              this.registerResponse = RegisterResponse.fromJson(registerResponse);
              console.log(this.registerResponse)
              if (this.registerResponse.hasNoErrors()) {
                this.verifyEmailService.sendEmailVerification(this.emailInput, this.registerResponse.token)
                  .then(sendEmailVerificationResponse => {
                    this.emailVerificationResponse = sendEmailVerificationResponse;
                  })
                  .catch(error => {
                    this.emailVerificationResponse.errors.push(error);
                    resolve(false);
                  });
              } else {
                console.log("Errors in registration: ", this.registerResponse.errorLists);
                resolve(false);
              }

            },
            error: (error: HttpErrorResponse) => {
              console.log("Error in adding new user: ", error);
              resolve(false);
            }
          })
        } else {
          console.log("Form is invalid")
          resolve(false)
        }
      })
    }).then(success => {
      super.onSubmit();
      this.formValidated = false;

      if (!success) this.resetCaptcha();
    });
  }

  override async isFormValid(): Promise<boolean> {
    if (this.isUsernameValid() &&
      this.isEmailProper(this.emailInput) &&
      this.isPasswordsMatch() &&
      this.isPasswordProper(this.passwordInput)) {
      return await this.checkCaptcha().then()
    } else {
      return Promise.resolve(false);
    }
  }

  isEmailInvalid(): boolean {
    return !this.isEmailProper(this.emailInput) && this.isSubmitted;
  }

  isUsernameInvalid(): boolean {
    return !this.isUsernameValid() && this.isSubmitted;
  }

  isUsernameValid(): boolean {
    return this.isFieldProper(this.usernameInput);
  }

  isPasswordInvalid(): boolean {
    return !(this.isPasswordProper(this.passwordInput)) && this.isSubmitted;
  }

  isPasswordsNotMatch(): boolean {
    return !this.isPasswordsMatch() && this.isSubmitted;
  }

  isPasswordsMatch(): boolean {
    return this.passwordInput === this.confirmPasswordInput;
  }
}
