export class SendEmailVerificationResponse {
  errors: string[];

  constructor(errors: string[]) {
    this.errors = errors;
  }
}
