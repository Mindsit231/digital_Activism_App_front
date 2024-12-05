// import {PostImage} from "./post-image";
// import {PostVideo} from "./post-video";
// import {TagPerPost} from "./tag-per-post";


import {PostImage} from './post-image';
import {PostVideo} from './post-video';
import {Tag} from '../tag';

export class PostDTO {
  postId: number | undefined;
  title: string;
  creationDate: string;
  body: string;

  memberId: number;

  postImageList: PostImage[] = [];
  postVideoList: PostVideo[] = [];

  tagList: Tag[] = [];

  likesCount: number | undefined;

  constructor(title: string, creationDate: string, body: string, memberId: number, postId?: number) {
    this.postId = postId;
    this.title = title;
    this.creationDate = creationDate;
    this.body = body;
    this.memberId = memberId;
  }

  static fromJson(jsonPost: PostDTO): PostDTO {
    let post = new PostDTO(jsonPost.title, jsonPost.creationDate, jsonPost.body, jsonPost.memberId, jsonPost.postId);
    // post.tagPerPostList = TagPerPost.initializeTagPerPostList(jsonPost.tagPerPostList);
    // post.postImageList = PostImage.initializePostImages(jsonPost.postImageList);
    // post.postVideoList = PostVideo.initializePostVideos(jsonPost.postVideoList);

    return post;
  }

  static initializePosts(jsonPosts: PostDTO[]) {
    let posts: PostDTO[] = [];
    if (jsonPosts != undefined) {
      for (let jsonPost of jsonPosts) {
        posts.push(PostDTO.fromJson(jsonPost));
      }
    }
    return posts;
  }

  setLikesCount(likesCount: number) {
    this.likesCount = likesCount;
  }

  getLikesCount(): number | undefined {
    return this.likesCount;
  }
}
