import {TagPerMember} from "../tag/tag-per-member";

export class MemberDto {
    protected id: number | undefined;

    username: string;
    email: string;
    password: string;
    role: string;

    creationDate: string | undefined;
    pfpName: string | undefined;
    token: string | undefined;

    tagPerMemberList: TagPerMember[] = [];

    // PFP IMAGE URL (COMPUTED WHEN NEEDED)
    pfpImgUrl: string | undefined;

    constructor(username: string, email: string, password: string, birthdate: string,
                creationDate?: string, token?: string,
                userId?: number, pfpImgPath?: string) {
        this.id = userId;

        this.email = email;
        this.username = username;
        this.password = password;
        this.role = birthdate;

        this.creationDate = creationDate;
        this.token = token;
        this.pfpName = pfpImgPath;
    }

    static fromJson(jsonMember: MemberDto): MemberDto {
        return new MemberDto(jsonMember.username, jsonMember.email, jsonMember.password, jsonMember.role, jsonMember.creationDate, jsonMember.token, jsonMember.id, jsonMember.pfpName);
    }

    hasPfp(): boolean {
        return this.pfpName !== null &&
            this.pfpName !== undefined &&
            this.pfpName.length > 0;
    }

    setPfpUrl(pfpImgUrl: string) {
        this.pfpImgUrl = pfpImgUrl;
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
