export class ResetPasswordRequest {
  newPassword: string;

  constructor(newPassword: string) {
    this.newPassword = newPassword;
  }
}
