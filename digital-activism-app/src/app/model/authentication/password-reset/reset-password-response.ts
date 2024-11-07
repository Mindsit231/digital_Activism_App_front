import {ErrorList} from '../error-list';

export class ResetPasswordResponse {
  errorLists: ErrorList[] = [];
  success: boolean = false;

  constructor() {}
}
