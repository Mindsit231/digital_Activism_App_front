import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaModule} from "ng-recaptcha-2";
import {FormsModule} from "@angular/forms";
import {LogoComponent} from "../../logo/logo.component";
import {FooterComponent} from "../../footer/footer.component";
import {MemberService} from "../../../service/member.service";
import {CurrentMemberService} from "../../../service/current-member.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {MemberDto} from "../../../model/member/member-dto";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import {environment} from "../../../../environment/environment.prod";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {AuthenticationComponent} from "../authentication-component";
import {AuthenticationService} from '../../../service/authentication.service';
import {NgxResizeObserverModule} from 'ngx-resize-observer';
import {HttpErrorResponse} from '@angular/common/http';
import {RegisterRequest} from '../../../model/authentication/register-request';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    RecaptchaModule,
    FormsModule,
    LogoComponent,
    FooterComponent,
    NgxResizeObserverModule
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
  faXmark = faXmark;

  // Form fields
  emailInput: string = "";
  usernameInput: string = "";
  passwordInput: string = "";
  confirmPasswordInput: string = "";

  // Logic Fields
  isEmailExists: boolean = false;
  isMemberAdded: boolean = false;

  @Output() onUserAddedEmitter = new EventEmitter<MemberDto>();

  constructor(protected override memberService: MemberService,
              protected override currentMemberService: CurrentMemberService,
              protected override authenticationService: AuthenticationService,
              protected override recaptchaService: ReCaptchaService,
              protected override cookieService: CookieService,
              protected override router: Router, protected override route: ActivatedRoute,
              private internalObjectService: InternalObjectService<{
                verificationCodeHash: string,
                memberDto: MemberDto
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
          console.log("Form is valid")
          this.sendVerificationEmail(this.emailInput.toLowerCase()).then(verificationCodeHash => {
            if (verificationCodeHash != null) {
              // Adding the new user to the database
              let registerRequest = new RegisterRequest(this.usernameInput, this.emailInput, this.passwordInput);
              this.authenticationService.register(registerRequest).subscribe({
                next: (jsonMemberDto: MemberDto) => {
                  console.log("User added: ", jsonMemberDto);
                  this.currentMemberService.setCounter(0)
                  let memberDto: MemberDto = MemberDto.fromJson(jsonMemberDto);
                  this.setUserToken(memberDto.token!);
                  this.internalObjectService.setObject({
                    verificationCodeHash: verificationCodeHash,
                    memberDto: memberDto
                  });
                  this.router.navigate(['/verify-email'], {relativeTo: this.route}).then();
                  resolve(true);
                },
                error: (error: HttpErrorResponse) => {
                  console.log("Error in adding new user: ", error);
                  resolve(false);
                }
              })
            } else {
              resolve(false);
            }
          })
        } else {
          console.log("Form is invalid")
          resolve(false)
        }
      })
    }).then(success => {
      if (!success) super.onSubmit();
    });
  }

  override async isFormValid(): Promise<boolean> {
    return await this.checkCaptcha().then() &&
      this.isUsernameValid() &&
      this.isEmailProper(this.emailInput) &&
      this.isPasswordsMatch() &&
      this.isPasswordProper(this.passwordInput);
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

  isUserNotAdded(): boolean {
    return !this.isMemberAdded && this.isSubmitted;
  }

  private clearValues() {
    this.isSubmitted = false;
    this.isEmailExists = false;
    this.emailInput = "";
    this.usernameInput = "";
    this.passwordInput = "";
    this.confirmPasswordInput = "";
  }
}
