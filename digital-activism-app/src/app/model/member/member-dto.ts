export class MemberDTO {
  id: number;
  username: string;
  pfpName: string | undefined;

  email: string;
  emailVerified: boolean;
  password: string;
  role: string;

  token: string;
  creationDate: string;

  // PFP IMAGE URL (COMPUTED WHEN NEEDED)
  pfpUrl: string | undefined;

  constructor(id: number, username: string, pfpName: string | undefined, email: string, emailVerified: boolean, password: string, role: string, token: string, creationDate: string) {
    this.id = id;
    this.username = username;
    this.pfpName = pfpName;
    this.email = email;
    this.emailVerified = emailVerified;
    this.password = password;
    this.role = role;
    this.token = token;
    this.creationDate = creationDate;
  }

  static fromJson(memberDTOJson: any): MemberDTO {
    return new MemberDTO(
      memberDTOJson.id,
      memberDTOJson.username,
      memberDTOJson.pfpName,
      memberDTOJson.email,
      memberDTOJson.emailVerified,
      memberDTOJson.password,
      memberDTOJson.role,
      memberDTOJson.token,
      memberDTOJson.creationDate
    );
  }

  setEmail(email: string) {
    this.email = email;
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

  getPfpImgPrefix(): string {
    return this.id + "-";
  }

  setPfpName(pfpName: string) {
    this.pfpName = pfpName;
  }
}
