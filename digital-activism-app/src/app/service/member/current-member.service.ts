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
  protected tokenService: TokenService = inject(TokenService);

  private _memberDTO!: MemberDTO | undefined;

  constructor() {}

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

  // initializeMemberBySavedToken(): Promise<boolean> {
  //   return new Promise<boolean>((resolve) => {
  //     if (this.tokenService.hasUserToken()) {
  //       this.authenticationService.loginByToken(this.tokenService.getUserToken())
  //         .then(
  //           (memberDTO: MemberDTO) => {
  //             if (memberDTO != null) {
  //               this.memberDTO = MemberDTO.fromJson(memberDTO);
  //               this.tokenService.setUserToken(this.memberDTO.token!);
  //
  //               resolve(true);
  //             } else {
  //               console.log('User not found');
  //               resolve(false);
  //             }
  //           },
  //           (error: Error) => {
  //             resolve(false);
  //             console.log('HTTP Error: User not found');
  //           }
  //         );
  //     } else {
  //       resolve(false);
  //     }
  //   });
  // }

  // initializeMember(memberDTO: MemberDTO) {
  //   this.member = MemberDTO.fromJson(memberDTO);
  //   this.tokenService.setUserToken(this.member.token!);
  //   // this.initializeMemberPfpImgUrl().then();
  //
  //   console.log(this.member)
  // }

  // private initializeMemberPfpImgUrl(): Promise<boolean> {
  //   return new Promise<boolean>((resolve, reject) => {
  //     if (this.member?.hasPfp()) {
  //       this.memberService.downloadFiles(this.member?.pfpName!, this.tokenService.getUserToken()).subscribe({
  //         next: (httpEvent: HttpEvent<Blob>) => {
  //           if (httpEvent.type === HttpEventType.Response) {
  //             const file: File = this.getFile(httpEvent);
  //             this.member?.setPfpUrl(URL.createObjectURL(file));
  //             resolve(true);
  //           }
  //         },
  //         error: (error: HttpErrorResponse) => {
  //           console.log("Error downloading file");
  //           resolve(false);
  //         }
  //       });
  //     } else {
  //       console.log("User does not have pfp img");
  //       resolve(false);
  //     }
  //   });
  // }
  //
  // private getFile(httpEvent: HttpResponse<Blob>) {
  //   return new File(
  //     [httpEvent.body!],
  //     httpEvent.headers.get('File-Name')!,
  //     {
  //       type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`
  //     });
  // }
}
