export class Visibility {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  public static getVisibilityByName(name: string): Visibility | undefined {
    return VISIBILITY_LIST.find(visibility => visibility.name === name);
  }
}

export const PUBLIC = new Visibility("PUBLIC");
export const PRIVATE = new Visibility("PRIVATE");

export const VISIBILITY_LIST = [PUBLIC, PRIVATE];


