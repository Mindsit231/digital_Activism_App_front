export  class VerifyEmailRequest {
  email: string;
  verificationCode: string;
  verificationCodeHash: string;

  constructor(email: string, verificationCode: string, verificationCodeHash: string) {
    this.email = email;
    this.verificationCode = verificationCode;
    this.verificationCodeHash = verificationCodeHash;
  }
}
