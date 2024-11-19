import {ErrorList} from '../error-list';
import {ErrorLists} from '../error-lists';

export class RegisterResponse {
  token: string;
  errorLists: ErrorLists;

  constructor(errorLists: ErrorLists, token: string) {
    this.errorLists = errorLists;
    this.token = token;
  }


  static fromJson(registerResponseJson: RegisterResponse): RegisterResponse {
    let errorLists: ErrorLists = ErrorLists.fromJson(registerResponseJson.errorLists);
    return new RegisterResponse(errorLists, registerResponseJson.token);
  }

  public findErrorListByName(name: string): ErrorList {
    let errorList: ErrorList | undefined = this.errorLists.errorList.find(errorList => errorList.name === name)
    if (errorList != undefined) {
      return errorList
    } else {
      return new ErrorList("", []);
    }
  }

  hasNoErrors() {
    let hasNoErrors: boolean = true;

    for (let errorList of this.errorLists.errorList) {
      if (errorList.errors.length > 0) {
        hasNoErrors = false;
        break;
      }
    }

    return hasNoErrors;
  }
}
