export class ReCaptchaResponse {
  success: boolean
  challenge_ts: string
  hostname: string
  error_codes: string[] | undefined

  constructor(success: boolean, challenge_ts: string, hostname: string, error_codes?: string[]) {
    this.success = success;
    this.challenge_ts = challenge_ts;
    this.hostname = hostname;
    this.error_codes = error_codes;
  }
}
