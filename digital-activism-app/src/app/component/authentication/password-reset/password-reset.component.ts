import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthenticationComponent} from "../authentication-component";
import {NgIf} from "@angular/common";
import {RECAPTCHA_SETTINGS, RecaptchaComponent, RecaptchaModule} from "ng-recaptcha-2";
import {environment} from "../../../../environment/environment.prod";
import {LogoComponent} from "../../logo/logo.component";
import {ActivatedRoute} from "@angular/router";
import {StorageKeys} from "../../misc/storage-keys";
import {CookieService} from "ngx-cookie-service";
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {MemberService} from "../../../service/member/member.service";
import {RouterService} from '../../../service/router.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {ResetPasswordRequest} from '../../../model/authentication/password-reset/reset-password-request';
import {ResetPasswordResponse} from '../../../model/authentication/password-reset/reset-password-response';
import {HttpErrorResponse} from '@angular/common/http';
import {ReCaptchaService} from '../../../service/reCaptcha/re-captcha.service';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RecaptchaModule,
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
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css', '../auth.styles.scss']
})
export class PasswordResetComponent extends AuthenticationComponent implements OnInit {
  override getRecaptchaRef(): RecaptchaComponent {
    return this.captchaRef;
  }

  // Input Fields
  newPasswordInput: string = "";
  newPasswordConfirmInput: string = "";

  // Logic Fields
  token: string | null = "";
  _isPasswordReset: boolean = false;

  resetPasswordResponse: ResetPasswordResponse = new ResetPasswordResponse();

  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent

  constructor(protected memberService: MemberService,
              protected cookieService: CookieService,
              protected routerService: RouterService,
              protected authenticationService: AuthenticationService,
              protected override reCaptchaService: ReCaptchaService,
              protected route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log(params)
      this.token = params[StorageKeys.USER_TOKEN];
    });
  }


  override onSubmit() {
    // new Promise<boolean>((resolve, reject) => {
    //   if (this.isFormValid()) {
    //     if (this.token != null) {
    //       this.memberService.findMemberByToken({token: this.token}).subscribe({
    //         next: (jsonMember: MemberDto) => {
    //           if (jsonMember != null) {
    //             if (this.token == jsonMember.token) {
    //               bcrypt.compare(this.newPasswordInput, jsonMember.password).then(success => {
    //                 if (!success) {
    //                   bcrypt.hash(this.newPasswordInput, this.hashSalt, (err, hashPassword) => {
    //                     this.memberService.updatePasswordByEmail({
    //                       email: jsonMember.email,
    //                       newPassword: hashPassword
    //                     })
    //                       .subscribe({
    //                         next: (success: number) => {
    //                           if (success == 1) {
    //                             console.log("Password updated");
    //                             this.resetTokenByOldToken()
    //                               .then((success) => {
    //                                 resolve(success);
    //                               });
    //                           } else {
    //                             console.log("Password not updated");
    //                             resolve(false);
    //                           }
    //                         },
    //                         error: (e: HttpErrorResponse) => {
    //                           console.log("HTTP Error: Password not updated");
    //                           resolve(false);
    //                         }
    //                       });
    //                   });
    //                 } else {
    //                   this.isPasswordSame = success;
    //                   console.log("Password is the same")
    //                   resolve(false);
    //                 }
    //               });
    //             } else {
    //               console.log("Tokens are different")
    //               resolve(false)
    //             }
    //           } else {
    //             console.log("User not found");
    //             resolve(false);
    //           }
    //         },
    //         error: (e: HttpErrorResponse) => {
    //           console.log("HTTP Error: User not found");
    //           resolve(false);
    //         }
    //       });
    //     }
    //   } else {
    //     resolve(false)
    //   }
    // }).then((success) => {
    //   super.onSubmit();
    //   if (success) {
    //     this._isPasswordReset = true;
    //   }
    // });

    new Promise<boolean>((resolve, reject) => {
      this.isFormValid().then((isFormValid) => {
        if (isFormValid) {
          this.formValidated = true;
          let resetPasswordRequest: ResetPasswordRequest = new ResetPasswordRequest(this.newPasswordInput);
          this.authenticationService.resetPassword(resetPasswordRequest, this.token!).subscribe({
            next: (resetPasswordResponse: ResetPasswordResponse) => {
              this.resetPasswordResponse = resetPasswordResponse;
              if(this.resetPasswordResponse.success) {
                resolve(true);
              } else {
                resolve(false);
              }
            },
            error: (error: HttpErrorResponse) => {
              console.error(error);
              resolve(false);
            }
          })
        } else {
          console.error('Form is invalid');
          resolve(false);
        }
      })
    }).then(success => {
      super.onSubmit();
      this.formValidated = false;

      if (success) {
        this._isPasswordReset = true;
      } else {
        this.resetCaptcha();
      }
    })

  }

  override async isFormValid(): Promise<boolean> {
    if (this.isPasswordsMatch()
      && this.isPasswordProper(this.newPasswordInput)) {
      return await this.checkCaptcha();
    } else {
      return Promise.resolve(false);
    }
  }

  isPasswordsNotMatch() {
    return !this.isPasswordsMatch() && this.isSubmitted;
  }


  isPasswordInvalid() {
    return !this.isPasswordProper(this.newPasswordInput) && this.isSubmitted;
  }

  isPasswordsMatch(): boolean {
    return this.newPasswordInput === this.newPasswordConfirmInput;
  }

  isPasswordReset(): boolean {
    return this._isPasswordReset && this.isSubmitted;
  }
}
