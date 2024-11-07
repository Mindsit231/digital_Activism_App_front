export  class VerifyEmailRequest {
  email: string;
  verificationCode: string;

  constructor(email: string, verificationCode: string) {
    this.email = email;
    this.verificationCode = verificationCode;
  }
}
