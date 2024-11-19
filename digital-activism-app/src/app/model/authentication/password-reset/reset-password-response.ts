import {ErrorLists} from '../error-lists';

export class ResetPasswordResponse {
  errorLists: ErrorLists;
  success: boolean;


  constructor() {
    this.errorLists = new ErrorLists([]);
    this.success = false;
  }
}
