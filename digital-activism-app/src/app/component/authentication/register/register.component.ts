import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaComponent, RecaptchaModule} from "ng-recaptcha-2";
import {FormsModule} from "@angular/forms";
import {LogoComponent} from "../../logo/logo.component";
import {FooterComponent} from "../../footer/footer.component";
import {MemberService} from "../../../service/member.service";
import {CurrentMemberService} from "../../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberDTO} from "../../../model/member/member-dto";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import {environment} from "../../../../environment/environment.prod";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationComponent} from "../authentication-component";
import {AuthenticationService} from '../../../service/authentication.service';
import {NgxResizeObserverModule} from 'ngx-resize-observer';
import {HttpErrorResponse} from '@angular/common/http';
import {RegisterRequest} from '../../../model/authentication/register-request';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';
import {EmailVerificationRequest} from '../../../model/authentication/email-verification-request';
import {RegisterResponse} from '../../../model/authentication/register-response';
import {EmailVerificationResponse} from '../../../model/authentication/email-verification-response';
import {MatProgressBar, MatProgressBarModule} from '@angular/material/progress-bar';

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

  registerResponse: RegisterResponse = new RegisterResponse([]);
  emailVerificationResponse = new EmailVerificationResponse([], "");

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent

  constructor(protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override authenticationService: AuthenticationService,
              protected override recaptchaService: ReCaptchaService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute,
              private internalObjectService: InternalObjectService<{
                verificationCodeHash: string,
                memberDto: MemberDTO
              }>) {
    super();
  }

  ngOnInit(): void {
    this.initializeMemberByToken().then();
  }

  override onSubmit() {
    new Promise<boolean>((resolve, reject) => {
      this.isFormValid().then((isFormValid) => {
        if (isFormValid) {
          this.formValidated = true;
          console.log("Form is valid")
          let registerRequest = new RegisterRequest(this.usernameInput, this.emailInput, this.passwordInput);
          this.authenticationService.register(registerRequest).subscribe({
            next: (registerResponse: RegisterResponse) => {
              this.registerResponse = RegisterResponse.fromJson(registerResponse);
              this.currentMemberService.setCounter(0)
              let memberDto: MemberDTO = this.registerResponse.memberDTO!;
              console.log(this.registerResponse)
              if (this.registerResponse.hasNoErrors()) {
                let verificationEmailRequest = new EmailVerificationRequest(memberDto.getToken()!, this.emailInput.toLowerCase());
                this.authenticationService.sendVerificationEmail(verificationEmailRequest).subscribe(emailVerificationResponse => {
                  this.emailVerificationResponse = emailVerificationResponse;
                  if (emailVerificationResponse != null && emailVerificationResponse.errors.length == 0) {
                    this.internalObjectService.setObject({
                      verificationCodeHash: emailVerificationResponse.verificationCodeHash,
                      memberDto: memberDto
                    });
                    this.router.navigate(['/verify-email'], {relativeTo: this.route}).then();
                    resolve(true);
                  } else {
                    console.log(emailVerificationResponse.errors)
                    resolve(false);
                  }
                })
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
      if (!success) {
        super.onSubmit();
        this.formValidated = false;
      }
      this.resetCaptcha();
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

  private clearValues() {
    this.isSubmitted = false;
    this.emailInput = "";
    this.usernameInput = "";
    this.passwordInput = "";
    this.confirmPasswordInput = "";
    this.registerResponse = new RegisterResponse([]);
    this.emailVerificationResponse = new EmailVerificationResponse([], "");
    this.formValidated = false;
  }
}
