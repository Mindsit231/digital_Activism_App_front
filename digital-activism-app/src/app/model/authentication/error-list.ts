export class ErrorList {
  name: string;
  errors: string[];

  constructor(name: string, errors: string[]) {
    this.name = name;
    this.errors = errors;
  }
}
