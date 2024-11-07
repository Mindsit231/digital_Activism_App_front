import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {FormComponent} from "../../misc/form-component";
import {ActivatedRoute, Router} from "@angular/router";
import {InternalObjectService} from "../../../service/misc/internal-object.service";
import {HttpErrorResponse} from "@angular/common/http";
import {LogoComponent} from "../../logo/logo.component";
import {CookieService} from "ngx-cookie-service";
import {FooterComponent} from "../../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {MemberService} from '../../../service/member/member.service';
import {MemberDTO} from '../../../model/member/member-dto';
import {AuthenticationService} from '../../../service/authentication.service';
import {VerifyEmailResponse} from '../../../model/authentication/verify-email-response';
import {VerifyEmailRequest} from '../../../model/authentication/verify-email-request';
import {RouterService} from '../../../service/router.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    LogoComponent,
    FooterComponent,
    NgxResizeObserverModule,
    NgForOf
  ],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css', '../auth.styles.scss', '../../main/main.component.scss']
})
export class VerifyEmailComponent extends FormComponent implements OnInit {
  // Form Fields
  verificationCodeInput: string = "";

  // Logic Fields
  isCodeValid: boolean = false;

  verifyEmailResponse: VerifyEmailResponse = new VerifyEmailResponse([], false);

  constructor(protected memberService: MemberService,
              protected cookieService: CookieService,
              protected authenticationService: AuthenticationService,
              private internalObjectService: InternalObjectService<{
                verificationCodeHash: string,
                email: string
                token: string
              }>,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    console.log(this.internalObjectService.getObject());
  }

  override isFormValid(): Promise<boolean> {
    return Promise.resolve(this.verificationCodeInput.length > 0);
  }

  override onSubmit() {
    new Promise<boolean>((resolve, reject) => {
      this.isFormValid().then((isFormValid) => {
        let inputObject = this.internalObjectService.getObject();

        if (isFormValid && inputObject.verificationCodeHash != null) {
          let verifyEmailRequest = new VerifyEmailRequest(
            inputObject.email,
            this.verificationCodeInput,
            inputObject.verificationCodeHash
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
          console.log('Form is invalid');
          resolve(false);
        }
      });


    }).then((success) => {
      this.isCodeValid = success;
      super.onSubmit();
    });
  }
}
