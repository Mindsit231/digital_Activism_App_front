import {Component, OnInit} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {CookieService} from "ngx-cookie-service";
import {FooterHandlerComponent} from "../misc/footer-handler-component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faBars, faPlus, faXmark} from '@fortawesome/free-solid-svg-icons';
import 'resize-observer-polyfill/dist/ResizeObserver.global'
import {CurrentMemberService} from "../../service/member/current-member.service";
import {FormsModule} from "@angular/forms";
import {AutoCompleteModule} from 'primeng/autocomplete';
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {logout, ProfileMenuItem, profileMenuItems} from "../user-account/profile-menu-item/profile-menu-item";
import {MemberService} from "../../service/member/member.service";
import {navigationItems} from "./navigation-item";
import {AddPostModalComponent} from "../posts/add-post-modal/add-post-modal.component";
import {AuthenticationService} from '../../service/authentication.service';
import {RouterService} from '../../service/router.service';
import {TokenService} from '../../service/token.service';
import {MemberDTO} from '../../model/member/member-dto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent,
    FontAwesomeModule, NgStyle,
    FormsModule, AutoCompleteModule,
    NgxResizeObserverModule, NgIf, NgForOf, AddPostModalComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[header-body]': 'true'
  }
})
export class HeaderComponent extends FooterHandlerComponent implements OnInit {
  // Logic Fields
  showMenu: boolean = false;

  dropDownMenuTop: number = 0;
  // Font Awesome Icons
  faBars = faBars;
  faXmark = faXmark;
  faPlus = faPlus;

  navigationItems = navigationItems;
  profileMenuItems = profileMenuItems;

  constructor(protected currentMemberService: CurrentMemberService,
              protected authenticationService: AuthenticationService,
              protected memberService: MemberService,
              protected tokenService: TokenService,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    this.authenticationService.loginByToken().then(
      (memberDTO: MemberDTO) => {
        if (memberDTO != null && memberDTO.emailVerified) {
          this.tokenService.setUserToken(memberDTO.token!);
          this.currentMemberService.memberDTO = memberDTO;
        } else {
          console.error("Member is null or email is not verified");
        }
      }
    ).catch((error) => {
      console.log("Not logged in")
    });
  }

  routeToAndCloseBurgerMenu(profileMenuItem: ProfileMenuItem) {
    if (profileMenuItem != logout) {
      this.xMarkOnClick();
      this.routerService.routeTo(profileMenuItem.link)
    } else {
      this.currentMemberService.setMemberToNull();
      this.loginOnClick();
    }

    this.showMenu = false;
  }

  loginOnClick() {
    this.routerService.routeToLogin().then();
  }

  burgerMenuOnClick() {
    this.showMenu = !this.showMenu;
  }

  xMarkOnClick() {
    this.showMenu = false;
  }

  handleResize(entry: ResizeObserverEntry) {
    this.dropDownMenuTop = entry.contentRect.height + 10;
  }
}
