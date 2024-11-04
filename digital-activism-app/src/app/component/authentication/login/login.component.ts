import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaModule} from "ng-recaptcha-2";
import {FormsModule} from "@angular/forms";
import {environment} from "../../../../environment/environment.prod";
import {AuthenticationComponent} from "../authentication-component";
import {LogoComponent} from "../../logo/logo.component";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import {CookieService} from "ngx-cookie-service";
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {CurrentMemberService} from "../../../service/current-member.service";
import {MemberService, MIN_PASSWORD_LENGTH} from "../../../service/member.service";
import {MemberDto} from "../../../model/member/member-dto";
import {AuthenticationService} from '../../../service/authentication.service';
import {LoginRequest} from '../../../model/authentication/login-request';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';

// @ts-ignore
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    NgForOf, HttpClientModule,
    FormsModule,
    RecaptchaModule, NgIf, LogoComponent, FooterComponent, NgxResizeObserverModule
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
  // Form fields
  emailInput: string = "";
  passwordInput: string = "";

  // Logic Fields
  isLoginValid: boolean = false;
  isLoginChecked: boolean = false;

  constructor(protected override memberService: MemberService,
              protected override authenticationService: AuthenticationService,
              protected override recaptchaService: ReCaptchaService,
              protected override cookieService: CookieService,
              protected override currentMemberService: CurrentMemberService,
              protected override router: Router, protected override route: ActivatedRoute,
              private internalObjectService: InternalObjectService<{
                verificationCodeHash: string,
                member: MemberDto
              }>) {
    super();
  }

  ngOnInit(): void {
    if (this.hasUserToken()) {
      this.deleteUserToken();
    }
  }

  override onSubmit() {
    new Promise<boolean>((resolve) => {
      this.isFormValid().then((isFormValid) => {
        if (isFormValid) {
          let loginRequest = new LoginRequest(this.emailInput, this.passwordInput);
          this.authenticationService.verifyLogin(loginRequest).subscribe(({
            next: (jsonMemberDTO: MemberDto) => {
              this.isLoginChecked = true;
              if (jsonMemberDTO != null) {
                console.log('Login is valid');
                this.isLoginValid = true;
                this.initializeMember(jsonMemberDTO);
                resolve(true);
              }
            },
            error: (error: HttpErrorResponse) => {
              console.log('Login is invalid / HTTP ERROR');
              resolve(false);
            }
          }));

        } else {
          console.log('Form is invalid');
          resolve(false);
        }
      });
    }).then(success => {
      super.onSubmit();

      if (success && this.isLoginValid) {
        this.routeToHome().then();
      }
    });
  }

  override async isFormValid(): Promise<boolean> {
    return await this.checkCaptcha() &&
      this.isEmailProper(this.emailInput) &&
      this.passwordInput.length > 0;
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
