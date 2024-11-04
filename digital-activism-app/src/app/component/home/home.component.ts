import {Component, ElementRef, OnInit} from '@angular/core';
import {CookieComponent} from "../misc/cookie-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterComponent} from "../footer/footer.component";
import {CurrentMemberService} from "../../service/current-member.service";
import {MemberService} from "../../service/member.service";
import {CookieService} from "ngx-cookie-service";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgxResizeObserverModule,
    FooterComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends CookieComponent implements OnInit {

  constructor(private el: ElementRef,
              protected override cookieService: CookieService,
              protected override currentMemberService: CurrentMemberService,
              protected override memberService: MemberService,
              protected override router: Router, protected override route: ActivatedRoute) {
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
    //       next: (jsonPosts: Post[]) => {
    //         this.allPosts = Post.initializePosts(jsonPosts);
    //         this.initializePostsMedia(this.allPosts).then();
    //       }
    //     });
    //   }
    // });

    this.el.nativeElement.style.width = `100%`;
  }
}
