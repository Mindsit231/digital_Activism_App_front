export class TagDTO {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public static fromJson(jsonTag: TagDTO): TagDTO {
    return new TagDTO(jsonTag.id, jsonTag.name);
  }

  static initializeTags(tagList: TagDTO[]) {
    let tags: TagDTO[] = [];
    if (tagList != undefined) {
      for (let jsonTag of tagList) {
        tags.push(TagDTO.fromJson(jsonTag));
      }
    }
    return tags;
  }

  public toString() {
    return this.name;
  }
}
