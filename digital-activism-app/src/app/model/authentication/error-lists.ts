import {ErrorList} from './error-list';

export class ErrorLists {
  errorList: ErrorList[] = [];

  constructor(errorList: ErrorList[]) {
    this.errorList = errorList;
  }

  public static fromJson(errorLists: ErrorLists) {
    return new ErrorLists(errorLists.errorList);
  }

  public findErrorListByName(name: string): ErrorList | undefined {
    let errorList: ErrorList | undefined = this.errorList.find(errorList => errorList.name === name)
    if (errorList != undefined) {
      return errorList
    } else {
      return new ErrorList("", [])
    }
  }
}
