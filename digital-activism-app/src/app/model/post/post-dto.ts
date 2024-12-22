import {PostImageDTO} from './post-image-dto';
import {PostVideoDTO} from './post-video-dto';
import {TagDTO} from '../tag/tag-dto';
import {MemberDTOShort} from '../member/member-dto-short';

export class PostDTO {
  id: number;
  title: string;
  content: string;
  visibility: string;
  communityId: number;

  creationDate: string;

  memberDTOShort: MemberDTOShort;
  postImageDTOS: PostImageDTO[];
  postVideoDTOS: PostVideoDTO[];
  tagList: TagDTO[];

  likesCount: number;
  liked: boolean;


  constructor(id: number, title: string, content: string, visibility: string, communityId: number, creationDate: string, memberDTOShort: MemberDTOShort, postImageDTOS: PostImageDTO[], postVideoDTOS: PostVideoDTO[], tagList: TagDTO[], likesCount: number, liked: boolean) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.visibility = visibility;
    this.communityId = communityId;
    this.creationDate = creationDate;
    this.memberDTOShort = memberDTOShort;
    this.postImageDTOS = postImageDTOS;
    this.postVideoDTOS = postVideoDTOS;
    this.tagList = tagList;
    this.likesCount = likesCount;
    this.liked = liked;
  }

  static fromJson(jsonPostDTO: PostDTO): PostDTO {
    return new PostDTO(
      jsonPostDTO.id,
      jsonPostDTO.title,
      jsonPostDTO.content,
      jsonPostDTO.visibility,
      jsonPostDTO.communityId,
      jsonPostDTO.creationDate,
      MemberDTOShort.fromJson(jsonPostDTO.memberDTOShort),
      PostImageDTO.initializePostImages(jsonPostDTO.postImageDTOS),
      PostVideoDTO.initializePostVideos(jsonPostDTO.postVideoDTOS),
      TagDTO.initializeTags(jsonPostDTO.tagList),
      jsonPostDTO.likesCount,
      jsonPostDTO.liked
    );
  }

  public toggleLike() {
    this.liked = !this.liked;
    if (this.liked) {
      this.likesCount++;
    } else {
      this.likesCount--;
    }
  }
}
