export class PostImageRequest {
  name: string;
  originalName: string;

  imageUrl: string | undefined;

  constructor(name: string, originalName: string) {
    this.name = name;
    this.originalName = originalName;
  }
}
