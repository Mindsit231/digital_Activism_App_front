import {MemberDTO} from '../member/member-dto';
import {ErrorList} from './error-list';

export class RegisterResponse {
  errorLists: ErrorList[];
  memberDTO: MemberDTO | undefined;

  constructor(errors: ErrorList[], memberDto?: MemberDTO) {
    this.errorLists = errors;
    this.memberDTO = memberDto;
  }

  
  // todo - implement fromJson here and in ErrorList
  // static fromJson(json: any): RegisterResponse {
  //   let errorLists: ErrorList[] = json.errorLists.map((errorList: any) => ErrorList.fromJson(errorList));
  //   let memberDTO: MemberDTO | undefined = json.memberDTO != undefined ? MemberDTO.fromJson(json.memberDTO) : undefined;
  //   return new RegisterResponse(errorLists, memberDTO);
  // }

  public findErrorListByName(name: string): ErrorList {
    let errorList: ErrorList | undefined = this.errorLists.find(errorList => errorList.name === name)
    if(errorList != undefined) {
      return errorList
    } else {
      return new ErrorList("", []);
    }
  }
}
