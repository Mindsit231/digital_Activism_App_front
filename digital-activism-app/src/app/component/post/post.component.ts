import {Component, Input, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faThumbsUp, faUser} from "@fortawesome/free-solid-svg-icons";
import {NgForOf, NgIf} from "@angular/common";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {HttpErrorResponse} from "@angular/common/http";
import {RouterService} from '../../service/router.service';
import {MemberDTO} from '../../model/member/member-dto';
import {PostDTO} from '../../model/post/post-dto';
import {CurrentMemberService} from '../../service/member/current-member.service';
import {MemberService} from '../../service/member/member.service';
import {PostService} from '../../service/post.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    NgForOf,
    NgxResizeObserverModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  faThumbsUp = faThumbsUp;

  postOwner!: MemberDTO | undefined;
  @Input() post!: PostDTO;

  hasImages: boolean = false;
  hasVideos: boolean = false;

  justify: string = 'center';
  isPostLiked: boolean = false;

  constructor(protected currentMemberService: CurrentMemberService,
              protected memberService: MemberService,
              protected postService: PostService,
              protected routerService: RouterService) {
  }

  ngOnInit(): void {
    this.hasImages = this.post.postImageList.length > 0;
    this.hasVideos = this.post.postVideoList.length > 0;

    // this.initializePostLikesCount(this.post);
    // this.postService.isPostLikedByMember(
    //   new TwoIds(this.post.postId!, this.currentMemberService.member?.getMemberId()!)
    // ).subscribe({
    //   next: (isLiked: boolean) => {
    //     this.isPostLiked = isLiked;
    //   },
    //   error: (error: HttpErrorResponse) => console.error(error)
    // });
    //
    // if(this.postOwner == undefined) {
    //   this.memberService.findEntityById(this.post.memberId!).subscribe({
    //     next: (jsonMember: Member) => {
    //       this.postOwner = Member.fromJson(jsonMember);
    //       this.initializeMembersPfpImgUrl([this.postOwner]).then();
    //     }, error: (error: HttpErrorResponse) => console.error(error)
    //   });
    // }
  }

  onResize(entry: ResizeObserverEntry) {
    let height = entry.contentRect.height;
    let width = entry.contentRect.width;

    if ((width / 2) < height) {
      this.justify = 'start';
    } else {
      this.justify = 'center';
    }
  }

  onLikeClick() {
    // if(this.isPostLiked) {
    //   this.likedPostService.deleteByMemberIdAndPostId(
    //     new TwoIds(this.post.postId!, this.currentMemberService.member?.getMemberId()!)
    //   ).subscribe({
    //     next: (deleted: number) => {
    //       if(deleted == 1) {
    //         this.isPostLiked = false;
    //         this.post.setLikesCount(this.post.getLikesCount()! - 1);
    //         console.log("PostDto has been disliked");
    //       } else {
    //         console.error("PostDto could not be disliked");
    //       }
    //     }, error: (error: HttpErrorResponse) => console.error(error)
    //   });
    // } else {
    //   let likedPost = new LikedPost(this.post.postId!, this.currentMemberService.member?.getMemberId()!)
    //   this.likedPostService.addEntity(likedPost).subscribe({
    //     next: (added: LikedPost) => {
    //       if(added) {
    //         this.isPostLiked = true;
    //         this.post.setLikesCount(this.post.getLikesCount()! + 1);
    //         console.log("PostDto has been liked");
    //       } else {
    //         console.error("PostDto could not be liked");
    //       }
    //     }, error: (error: HttpErrorResponse) => console.error(error)
    //   });
    // }
  }

  protected readonly faUser = faUser;
}
