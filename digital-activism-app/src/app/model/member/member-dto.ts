import {Tag} from '../tag';

export class MemberDTO {
  protected id: number | undefined;

  username: string;
  email: string;
  emailVerified: boolean;
  password: string;
  role: string;

  token: string;
  creationDate: string;

  pfpName: string | undefined;
  // PFP IMAGE URL (COMPUTED WHEN NEEDED)
  pfpUrl: string | undefined;

  constructor(username: string, email: string, emailVerified: boolean, password: string, role: string,
              creationDate: string, token: string,
              userId?: number, pfpName?: string) {
    this.id = userId;

    this.email = email;
    this.emailVerified = emailVerified;
    this.username = username;
    this.password = password;
    this.role = role;

    this.creationDate = creationDate;
    this.token = token;
    this.pfpName = pfpName;
  }

  static fromJson(jsonMemberDto: MemberDTO): MemberDTO {
    return new MemberDTO(jsonMemberDto.username,
      jsonMemberDto.email, jsonMemberDto.emailVerified,
      jsonMemberDto.password, jsonMemberDto.role,
      jsonMemberDto.creationDate, jsonMemberDto.token,
      jsonMemberDto.id, jsonMemberDto.pfpName);
  }

  hasPfp(): boolean {
    return this.pfpName !== null &&
      this.pfpName !== undefined &&
      this.pfpName.length > 0;
  }

  setPfpUrl(pfpUrl: string) {
    this.pfpUrl = pfpUrl;
  }

  setUsername(username: string) {
    this.username = username;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  getPfpImgPrefix(): string {
    return this.id + "-";
  }

  setPfpName(pfpName: string) {
    this.pfpName = pfpName;
  }
}
