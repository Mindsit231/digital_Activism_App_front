import {MemberDTO} from "../../model/member/member-dto";
import {inject, Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpEventType, HttpResponse} from '@angular/common/http';
import {AuthenticationService} from '../authentication.service';
import {TokenService} from '../token.service';
import {MemberService} from './member.service';
@Injectable({
  providedIn: 'root'
})
export class CurrentMemberService {
  protected memberService: MemberService = inject(MemberService);
  protected authenticationService: AuthenticationService = inject(AuthenticationService);
  protected tokenService: TokenService = inject(TokenService);

  private _member!: MemberDTO | undefined;

  private counter: number = 0;
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

  initializeMemberByFetchingToken(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.tokenService.hasUserToken()) {
        this.authenticationService.loginByToken(this.tokenService.getUserToken())
          .subscribe({
            next: (memberDTO: MemberDTO) => {
              // let memberDTO: MemberDTO = this.tokenService.extractMemberFromToken(memberDTO);
              if (memberDTO != null) {
                this.initializeMember(memberDTO);

                resolve(true);
              } else {
                console.log('User not found');
                resolve(false);
              }
            },
            error: (error: HttpErrorResponse) => {
              resolve(false);
              console.log('HTTP Error: User not found');
            }
          });
      } else {
        resolve(false);
      }
    });
  }

  initializeMemberBySavedToken(): boolean {
    let token: string = this.tokenService.getUserToken();
    if (this.tokenService.hasUserToken()) {
      let memberDTO: MemberDTO = this.tokenService.extractMemberFromToken(token);

      if (token != null && token == memberDTO.token) {
        this.initializeMember(memberDTO);
        return true;
      } else {
        console.log('User not found');
        return false;
      }
    } else {
      return false;
    }
  }

  initializeMember(memberDTO: MemberDTO) {
    this.member = MemberDTO.fromJson(memberDTO);
    this.tokenService.setUserToken(this.member.token!);
    this.initializeMemberPfpImgUrl().then();

    console.log(this.member)
  }

  private initializeMemberPfpImgUrl(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.member?.hasPfp()) {
        this.memberService.downloadFiles(this.member?.pfpName!).subscribe({
          next: (httpEvent: HttpEvent<Blob>) => {
            if (httpEvent.type === HttpEventType.Response) {
              const file: File = this.getFile(httpEvent);
              this.member?.setPfpUrl(URL.createObjectURL(file));
              resolve(true);
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log("Error downloading file");
            resolve(false);
          }
        });
      } else {
        console.log("User does not have pfp img");
        resolve(false);
      }
    });
  }

  private getFile(httpEvent: HttpResponse<Blob>) {
    return new File([httpEvent.body!], httpEvent.headers.get('File-Name')!,
      {type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`});
  }
}
