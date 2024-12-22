import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faThumbsUp, faUser} from "@fortawesome/free-solid-svg-icons";
import {NgForOf, NgIf} from "@angular/common";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {RouterService} from '../../service/router.service';
import {MemberDTO} from '../../model/member/member-dto';
import {PostDTO} from '../../model/post/post-dto';
import {CurrentMemberService} from '../../service/member/current-member.service';
import {MemberService} from '../../service/member/member.service';
import {PostService} from '../../service/post/post.service';
import {TokenService} from '../../service/token.service';
import {getDateTime} from '../misc/functions';

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

  protected readonly faThumbsUp = faThumbsUp;
  protected readonly faUser = faUser;

  @Input() postDTO!: PostDTO;

  hasImages: boolean = false;
  hasVideos: boolean = false;

  justify: string = 'center';

  constructor(private el: ElementRef,
              protected currentMemberService: CurrentMemberService,
              protected memberService: MemberService,
              protected postService: PostService,
              protected routerService: RouterService) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.hasImages = this.postDTO.postImageDTOS.length > 0;
    this.hasVideos = this.postDTO.postVideoDTOS.length > 0;
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

  toggleLike() {
    console.log(this.postDTO.id!)
    this.postService.toggleLike(this.postDTO.id!).then(
      (response: boolean) => {
        if (response) {
          this.postDTO.toggleLike();
        }
      })
  }

  protected readonly getDateTime = getDateTime;
}
