import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FooterComponent} from "../footer/footer.component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterHandlerComponent} from "../misc/footer-handler-component";
import {UploadPfpModalComponent} from "./upload-pfp-modal/upload-pfp-modal.component";
import {CookieService} from "ngx-cookie-service";
import {RouterOutlet} from "@angular/router";
import {NgForOf, NgIf} from "@angular/common";
import {ProfileMenuItemComponent} from "./profile-menu-item/profile-menu-item.component";
import {profileMenuItems} from "./profile-menu-item/profile-menu-item";
import {UserSettingsComponent} from "./user-settings/user-settings.component";
import {MemberService} from "../../service/member/member.service";
import {AuthenticationService} from '../../service/authentication.service';
import {RouterService} from '../../service/router.service';
import {userAccountRoute, userSettingsRoute} from '../../app.routes';

@Component({
  selector: 'app-user-account',
  standalone: true,
  imports: [
    FaIconComponent,
    FooterComponent,
    NgxResizeObserverModule,
    UploadPfpModalComponent,
    NgIf,
    ProfileMenuItemComponent,
    NgForOf,
    RouterOutlet,
    UserSettingsComponent
  ],
  providers: [
    UploadPfpModalComponent,
  ],
  templateUrl: './user-account.component.html',
  styleUrl: './user-account.component.scss'
})
export class UserAccountComponent extends FooterHandlerComponent implements OnInit, AfterViewChecked {
  profileMenuItems = profileMenuItems;

  constructor(private cdr: ChangeDetectorRef,
              protected memberService: MemberService,
              protected authenticationService: AuthenticationService,
              protected cookieService: CookieService,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    if (this.routerService.isCurrentUrlRoute(`/${userAccountRoute}`)) {

      this.routerService.routeToUserSettings().then();
    }
  }

  ngAfterViewChecked(): void {
    profileMenuItems.forEach((profileMenuItem) => {
      if (profileMenuItem.link == this.routerService.getRouterUrl()) {
        profileMenuItem.class = "profile-menu-item-clicked";
      } else {
        profileMenuItem.class = "profile-menu-item";
      }
    });
    this.cdr.detectChanges();
  }
}
