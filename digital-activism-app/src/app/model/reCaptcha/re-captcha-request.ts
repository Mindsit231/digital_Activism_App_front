export class ReCaptchaRequest {
  secret: string
  response: string
  remoteIp!: string | undefined

  constructor(secret: string, response: string, remoteIp?: string) {
    this.secret = secret;
    this.response = response;
    this.remoteIp = remoteIp;
  }
}
