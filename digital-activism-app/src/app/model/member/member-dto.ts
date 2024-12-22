import {MemberDTOShort} from './member-dto-short';

export class MemberDTO extends MemberDTOShort{
  email: string;
  emailVerified: boolean;
  password: string;
  role: string;

  token: string;
  creationDate: string;

  constructor(username: string, email: string, emailVerified: boolean, password: string, role: string,
              creationDate: string, token: string,
              id: number, pfpName?: string) {
    super(id, username, pfpName);

    this.id = id;

    this.email = email;
    this.emailVerified = emailVerified;
    this.username = username;
    this.password = password;
    this.role = role;

    this.creationDate = creationDate;
    this.token = token;
    this.pfpName = pfpName;
  }

  static override fromJson(jsonMemberDto: MemberDTO): MemberDTO {
    return new MemberDTO(jsonMemberDto.username,
      jsonMemberDto.email, jsonMemberDto.emailVerified,
      jsonMemberDto.password, jsonMemberDto.role,
      jsonMemberDto.creationDate, jsonMemberDto.token,
      jsonMemberDto.id, jsonMemberDto.pfpName);
  }

  setEmail(email: string) {
    this.email = email;
  }
}
