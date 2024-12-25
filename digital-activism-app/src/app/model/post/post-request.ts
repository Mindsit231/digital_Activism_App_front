import {PostImageRequest} from "./post-image-request";
import {PostVideoRequest} from "./post-video-request";

export class PostRequest {
    title: string;
    content: string;
    visibility: string;
    communityId: number;
    memberId: number;

    postImageRequests: PostImageRequest[] = [];
    postVideoRequests: PostVideoRequest[] = [];
    tagList: string[] = [];

    constructor(title: string, content: string, visibility: string, communityId: number, memberId: number) {
        this.title = title;
        this.content = content;
        this.visibility = visibility;
        this.communityId = communityId;
        this.memberId = memberId;
    }
}
