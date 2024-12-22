export class Visibility {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export const PUBLIC = new Visibility("PUBLIC");
export const PRIVATE = new Visibility("PRIVATE");
