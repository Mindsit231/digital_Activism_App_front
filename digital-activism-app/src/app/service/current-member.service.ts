import {MemberDTO} from "../model/member/member-dto";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CurrentMemberService {
  private counter: number = 0;
  private _member!: MemberDTO | undefined;
  private mainPromise!: Promise<boolean>;

  constructor() {}

  public getCounter(): number {
    return this.counter;
  }

  public setCounter(counter: number): void {
    this.counter = counter;
  }

  public incrementCounter(): void {
    this.counter++;
  }

  isLoggedIn(): boolean {
    return this._member !== undefined && this._member !== null;
  }

  getMainPromise(): Promise<boolean> {
    return this.mainPromise;
  }

  setMainPromise(mainPromise: Promise<boolean>): void {
    this.mainPromise = mainPromise;
  }

  get member(): MemberDTO | undefined {
    return this._member;
  }

  set member(member: MemberDTO | undefined) {
    this._member = member;
  }

  setMemberToNull() {
    this.member = undefined;
  }
}
