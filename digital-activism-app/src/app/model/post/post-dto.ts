import {PostImageDTO} from './post-image-dto';
import {PostVideoDTO} from './post-video-dto';
import {TagDTO} from '../tag/tag-dto';
import {Visibility} from './visibility';
import {MemberDTO} from '../member/member-dto';

export class PostDTO {
  id: number;
  title: string;
  content: string;
  visibility: Visibility;
  communityId: number;

  creationDate: string;

  memberDTO: MemberDTO;
  postImageDTOS: PostImageDTO[];
  postVideoDTOS: PostVideoDTO[];
  tagList: TagDTO[];

  likesCount: number;
  liked: boolean;


  constructor(id: number, title: string, content: string, visibility: Visibility, communityId: number, creationDate: string, memberDTO: MemberDTO, postImageDTOS: PostImageDTO[], postVideoDTOS: PostVideoDTO[], tagList: TagDTO[], likesCount: number, liked: boolean) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.visibility = visibility;
    this.communityId = communityId;
    this.creationDate = creationDate;
    this.memberDTO = memberDTO;
    this.postImageDTOS = postImageDTOS;
    this.postVideoDTOS = postVideoDTOS;
    this.tagList = tagList;
    this.likesCount = likesCount;
    this.liked = liked;
  }

  static fromJson(jsonPostDTO: any): PostDTO {
    return new PostDTO(
      jsonPostDTO.id,
      jsonPostDTO.title,
      jsonPostDTO.content,
      Visibility.getVisibilityByName(jsonPostDTO.visibility)!,
      jsonPostDTO.communityId,
      jsonPostDTO.creationDate,
      MemberDTO.fromJson(jsonPostDTO.memberDTO),
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
