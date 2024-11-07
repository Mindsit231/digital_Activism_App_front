export class RecoverPasswordRequest {
  email: string;
  pagePath: string;

  constructor(email: string, pagePath: string) {
    this.email = email;
    this.pagePath = pagePath;
  }
}
