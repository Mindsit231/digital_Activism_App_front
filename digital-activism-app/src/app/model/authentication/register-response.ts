import {MemberDTO} from '../member/member-dto';
import {ErrorList} from './error-list';

export class RegisterResponse {
  token: string;
  errorLists: ErrorList[];

  constructor(errors: ErrorList[], token: string) {
    this.errorLists = errors;
    this.token = token;
  }


  static fromJson(registerResponseJson: RegisterResponse): RegisterResponse {
    let errorLists: ErrorList[] = registerResponseJson.errorLists.map((errorList: any) => ErrorList.fromJson(errorList));
    return new RegisterResponse(errorLists, registerResponseJson.token);
  }

  public findErrorListByName(name: string): ErrorList {
    let errorList: ErrorList | undefined = this.errorLists.find(errorList => errorList.name === name)
    if(errorList != undefined) {
      return errorList
    } else {
      return new ErrorList("", []);
    }
  }

  hasNoErrors() {
    let hasNoErrors: boolean = true;

    for (let errorList of this.errorLists) {
      if (errorList.errors.length > 0) {
        hasNoErrors = false;
        break;
      }
    }

    return hasNoErrors;
  }
}
