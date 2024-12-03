import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaComponent, RecaptchaModule} from "ng-recaptcha-2";
import {FormsModule} from "@angular/forms";
import {environment} from "../../../../environment/environment.prod";
import {AuthenticationComponent, MIN_PASSWORD_LENGTH} from "../authentication-component";
import {LogoComponent} from "../../logo/logo.component";
import {CookieService} from "ngx-cookie-service";
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {CurrentMemberService} from "../../../service/member/current-member.service";
import {MemberService} from "../../../service/member/member.service";
import {MemberDTO} from "../../../model/member/member-dto";
import {AuthenticationService} from '../../../service/authentication.service';
import {LoginRequest} from '../../../model/authentication/login/login-request';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';
import {RouterService} from '../../../service/router.service';
import {TokenService} from '../../../service/token.service';
import {VerifyEmailService} from '../../../service/verify-email.service';
import {SendEmailVerificationResponse} from '../../../model/authentication/verify-email/send-email-verification-response';
import {MatProgressBar} from '@angular/material/progress-bar';
import {passwordRecoveryRoute, registerRoute} from '../../../app.routes';

// @ts-ignore
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf,
    FormsModule,
    RecaptchaModule, NgIf, LogoComponent, FooterComponent, NgxResizeObserverModule, MatProgressBar
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS, useValue: {
        siteKey: environment.siteKey
      }
    }
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.styles.scss']
})
export class LoginComponent extends AuthenticationComponent implements OnInit {
  override getRecaptchaRef(): RecaptchaComponent {
    return this.captchaRef;
  }

  // Form fields
  emailInput: string = "";
  passwordInput: string = "";

  // Logic Fields
  isLoginValid: boolean = false;
  isLoginChecked: boolean = false;

  emailVerificationResponse = new SendEmailVerificationResponse([]);

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent

  constructor(protected memberService: MemberService,
              protected authenticationService: AuthenticationService,
              protected cookieService: CookieService,
              protected currentMemberService: CurrentMemberService,
              protected routerService: RouterService,
              protected override tokenService: TokenService,
              protected override reCaptchaService: ReCaptchaService,
              protected verifyEmailService: VerifyEmailService) {
    super();
  }

  ngOnInit(): void {
    if (this.tokenService.hasUserToken()) {
      this.tokenService.deleteUserToken();
    }
  }

  override onSubmit() {
    new Promise<boolean>((resolve) => {
      this.isFormValid().then((isFormValid) => {
        if (isFormValid) {
          this.formValidated = true;
          let loginRequest = new LoginRequest(this.emailInput, this.passwordInput);
          this.authenticationService.verifyLogin(loginRequest).subscribe(({
            next: (jsonMemberDTO: MemberDTO) => {
              if (jsonMemberDTO != null) {
                console.log('Login is valid');
                if (!jsonMemberDTO.emailVerified) {
                  console.log('Email is not verified');
                  this.verifyEmailService.sendEmailVerification(this.emailInput, jsonMemberDTO.token!)
                    .then(sendEmailVerificationResponse => {
                      this.emailVerificationResponse = sendEmailVerificationResponse;
                    })
                    .catch(error => {
                      console.log(error);
                    }).finally(() => {
                      resolve(false)
                    });
                } else {
                  this.isLoginValid = true;
                  this.currentMemberService.initializeMember(jsonMemberDTO);
                  resolve(true);
                }
              }
            },
            error: (error: HttpErrorResponse) => {
              this.isLoginChecked = true;
              console.log('Login is invalid / HTTP ERROR');
              resolve(false);
            },
          }));

        } else {
          console.log('Form is invalid');
          resolve(false);
        }
      });
    }).then(success => {
      super.onSubmit();
      this.formValidated = false;

      if (success) {
        this.routerService.routeToHome().then();
      } else {
        this.resetCaptcha();
      }
    });
  }

  override async isFormValid(): Promise<boolean> {
    if(this.isEmailProper(this.emailInput) &&
      this.isPasswordValid()) {
      return await this.checkCaptcha()
    } else {
      return Promise.resolve(false);
    }
  }

  isEmailInvalid(): boolean {
    return !this.isEmailValid() && this.isSubmitted;
  }

  isEmailValid(): boolean {
    return this.isEmailProper(this.emailInput) && this.emailInput.length > 0;
  }

  isPasswordInvalid(): boolean {
    return !this.isPasswordValid() && this.isSubmitted;
  }

  isPasswordValid(): boolean {
    return this.passwordInput.length >= MIN_PASSWORD_LENGTH;
  }

  isLoginInvalid(): boolean {
    return !this.isLoginValid && this.isLoginChecked && this.isSubmitted;
  }
}
