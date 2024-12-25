export  class PostVideoRequest {
  name: string;
  originalName: string;
  videoUrl: string | undefined;

  constructor(name: string, originalName: string) {
    this.name = name;
    this.originalName = originalName;
  }
}
