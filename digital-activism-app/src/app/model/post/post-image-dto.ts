export class PostImageDTO {
  id: number | undefined;
  name: string;
  postId: number;

  imageUrl: string | undefined;

  constructor(name: string, postId: number, postImageId?: number) {
    this.id = postImageId;
    this.postId = postId;
    this.name = name;
  }

  public static fromJson(jsonPostImage: PostImageDTO): PostImageDTO {
    return new PostImageDTO(jsonPostImage.name, jsonPostImage.postId, jsonPostImage.id);
  }

  static initializePostImages(postImageList: PostImageDTO[]) {
    let postImages: PostImageDTO[] = [];
    if (postImageList != undefined) {
      for (let postImage of postImageList) {
        postImages.push(PostImageDTO.fromJson(postImage));
      }
    }
    return postImages;
  }
}
