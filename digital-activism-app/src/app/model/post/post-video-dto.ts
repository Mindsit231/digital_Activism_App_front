export class PostVideoDTO {
  id!: number | undefined;
  name: string;
  postId: number;

  length: number | undefined;
  size: number | undefined;

  videoUrl: string | undefined;
  mightDelete: boolean = false;

  constructor(name: string, postId: number, postVideoId?: number) {
    this.name = name;
    this.postId = postId;

    this.id = postVideoId;
  }

  public static fromJson(jsonPostVideo: PostVideoDTO): PostVideoDTO {
    return new PostVideoDTO(jsonPostVideo.name, jsonPostVideo.postId, jsonPostVideo.id);
  }

  static initializePostVideos(postVideoList: PostVideoDTO[]) {
    let postVideos: PostVideoDTO[] = [];
    if (postVideoList != undefined) {
      for (let postVideo of postVideoList) {
        postVideos.push(PostVideoDTO.fromJson(postVideo));
      }
    }
    return postVideos;
  }
}
