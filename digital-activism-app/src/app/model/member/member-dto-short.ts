export class MemberDTOShort {
  id: number;
  username: string;
  pfpName: string | undefined;

  // PFP IMAGE URL (COMPUTED WHEN NEEDED)
  pfpUrl: string | undefined;

  constructor(id: number, username: string, pfpName?: string) {
    this.id = id;
    this.username = username;
    this.pfpName = pfpName;
  }

  static fromJson(jsonMemberDtoShort: MemberDTOShort): MemberDTOShort {
    return new MemberDTOShort(
      jsonMemberDtoShort.id,
      jsonMemberDtoShort.username,
      jsonMemberDtoShort.pfpName);
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
