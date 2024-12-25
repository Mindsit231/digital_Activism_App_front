import {MemberDTO} from "../../model/member/member-dto";
import {inject, Injectable} from "@angular/core";
import {TokenService} from '../token.service';
import {MemberService} from './member.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentMemberService {
  private _memberDTO!: MemberDTO | undefined;

  constructor() {
  }

  isLoggedIn(): boolean {
    return this._memberDTO !== undefined && this._memberDTO !== null;
  }

  get memberDTO(): MemberDTO | undefined {
    return this._memberDTO;
  }

  set memberDTO(member: MemberDTO | undefined) {
    this._memberDTO = member;
  }

  setMemberToNull() {
    this.memberDTO = undefined;
  }
}
