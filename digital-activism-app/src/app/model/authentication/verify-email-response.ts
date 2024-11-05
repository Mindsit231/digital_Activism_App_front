export class VerifyEmailResponse {
  errors: string[];
  success: boolean;

  constructor(errors: string[], success: boolean) {
    this.errors = errors;
    this.success = success;
  }
}
