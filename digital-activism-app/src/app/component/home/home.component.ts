import {Component, ElementRef, OnInit} from '@angular/core';
import {FooterHandlerComponent} from "../misc/footer-handler-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterComponent} from "../footer/footer.component";
import {CurrentMemberService} from "../../service/member/current-member.service";
import {MemberService} from "../../service/member/member.service";
import {CookieService} from "ngx-cookie-service";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {MatProgressBar, MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        NgxResizeObserverModule,
        FooterComponent,
        NgForOf,
        NgIf,
        MatProgressBarModule
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends FooterHandlerComponent implements OnInit {

  constructor(private el: ElementRef,
              protected cookieService: CookieService,
              protected currentMemberService: CurrentMemberService,
              protected memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    // this.initializeMemberByToken().then((success) => {
    //   if(this.currentMemberService.isLoggedIn()) {
    //     this.initializeCurrentMemberFriends().then((success) => {
    //       if(success) {
    //         this.initializeMembersPostsMedia(this.currentMemberService.member?.friends!).then();
    //         this.hasFriends = this.currentMemberService.member?.friends?.length! > 0;
    //         if(this.hasFriends) {
    //           this.currentMemberService.member?.friends?.forEach(friend => {
    //             if(friend.posts?.length > 0) {
    //               this.friendsHaveNoPosts = false;
    //             }
    //           })
    //         }
    //       }
    //     });
    //   }
    //   if(!this.currentMemberService.isLoggedIn() || this.currentMemberService.member?.friends?.length == 0){
    //     this.postService.getAllEntities().subscribe({
    //       next: (jsonPosts: PostDto[]) => {
    //         this.allPosts = PostDto.initializePosts(jsonPosts);
    //         this.initializePostsMedia(this.allPosts).then();
    //       }
    //     });
    //   }
    // });

    this.el.nativeElement.style.width = `100%`;
  }
}
