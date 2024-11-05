export class ErrorList {
  name: string;
  errors: string[];

  constructor(name: string, errors: string[]) {
    this.name = name;
    this.errors = errors;
  }

  static fromJson(json: any): ErrorList {
    return new ErrorList(json.name, json.errors);
  }
}
