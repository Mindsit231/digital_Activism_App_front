export class SendEmailVerificationResponse {
  errors: string[];
  verificationCodeHash: string;

  constructor(errors: string[], verificationCode: string) {
    this.errors = errors;
    this.verificationCodeHash = verificationCode;
  }
}
