import {FormComponent} from '../misc/form-component';
import {ReCaptchaService} from '../../service/reCaptcha/re-captcha.service';
import {ReCaptchaResponse} from '../../model/reCaptcha/re-captcha-response';
import {ReCaptchaRequest} from '../../model/reCaptcha/re-captcha-request';
import {environment} from '../../../environment/environment.prod';
import {MIN_PASSWORD_LENGTH} from '../../service/member/member.service';
import {RecaptchaComponent} from 'ng-recaptcha-2';

export abstract class AuthenticationComponent extends FormComponent {
  protected reCaptchaService!: ReCaptchaService;

  protected captcha: string | null = "";
  protected isCaptchaValid: boolean = false;
  protected isCaptchaChecked: boolean = false;

  // Validation messages
  protected passwordInvalidMessage: String = "Password must have at least one lowercase and uppercase letter, one number, one special character and " + MIN_PASSWORD_LENGTH + " characters long.";
  protected oldPasswordInvalidMessage: String = "Old Password is incorrect.";
  protected passwordsNotMatchMessage: String = "Passwords do not match.";
  protected emailInvalidMessage: String = "Email is invalid.";
  protected fieldInvalidMessage: String = "Field must be at least 3 characters long without any special characters.";
  protected notRobotMessage: string = "Please verify that you're not a robot."

  // Error Identifiers
  protected USERNAME_ERROR_IDENTIFIER = "Username";
  protected EMAIL_ERROR_IDENTIFIER = "Email";
  protected PASSWORD_ERROR_IDENTIFIER = "Password";

  protected constructor() {
    super();
  }

  resolved(captchaResponse: string | null) {
    this.captcha = captchaResponse;
  }

  isCaptchaInvalid(): boolean {
    return !this.isCaptchaValid && this.isCaptchaChecked && this.isSubmitted;
  }

  checkCaptcha(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.captcha != null && environment.reCaptchaEnabled) {
        let captchaRequest = new ReCaptchaRequest(environment.secretKey, this.captcha);
        console.log(captchaRequest);
        this.reCaptchaService.verifyCaptcha(captchaRequest).subscribe({
          next: (reCaptchaResponse: ReCaptchaResponse) => {
            console.log(reCaptchaResponse)
            this.isCaptchaValid = reCaptchaResponse.success;
            this.isCaptchaChecked = true;
            resolve(reCaptchaResponse.success);
          },
          error: (error) => {
            console.error(error);
            resolve(false);
          }
        });
      } else if (!environment.reCaptchaEnabled) {
        console.info("ReCaptcha is disabled. Skipping verification.")
        this.isCaptchaChecked = true;
        this.isCaptchaValid = true;
        resolve(true);
      } else {
        resolve(false);
      }
    })
  }

  resetCaptcha(): void {
    if(this.captcha != null && this.captcha.length > 0) {
      this.getRecaptchaRef().reset();
      this.captcha = "";
      this.isCaptchaValid = false;
      this.isCaptchaChecked = false;
    }
  }

  isEmailProper(email: string): boolean {
    let regex = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    return regex.test(email)
  }

  isPasswordProper(password: string): boolean {
    // Password must contain at least one number, one uppercase letter, one lowercase letter, one special character and at least 12 characters
    let regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{" + MIN_PASSWORD_LENGTH + ",}$");
    return regex.test(password);
  }

  isFieldProper(field: string): boolean {
    let regex = new RegExp("^[a-zA-Z0-9]*$");
    return regex.test(field) && field.length >= 3;
  }

  getRecaptchaRef(): RecaptchaComponent {
    return {} as RecaptchaComponent
  };
}
