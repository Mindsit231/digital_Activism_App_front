import {Component, OnInit} from '@angular/core';
import {LogoComponent} from "../logo/logo.component";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
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
import {AddEditPostModalComponent} from "../add-edit-post-modal/add-edit-post-modal.component";
import {AuthenticationService} from '../../service/authentication.service';
import {RouterService} from '../../service/router.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent,
    FontAwesomeModule, NgStyle,
    FormsModule, AutoCompleteModule,
    NgxResizeObserverModule, NgIf, NgForOf, AddEditPostModalComponent],
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
              protected cookieService: CookieService,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    this.currentMemberService.initializeMemberByFetchingToken().then();
  }

  routeToAndCloseBurgerMenu(profileMenuItem: ProfileMenuItem) {
    if (profileMenuItem != logout) {
      this.routerService.routeTo(profileMenuItem.link)
    } else {
      this.currentMemberService.setMemberToNull();
      this.loginOnClick();
    }

    this.showMenu = false;
  }

  loginOnClick() {
    this.routerService.routeTo("/login");
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

  registerOnClick() {
    this.routerService.routeTo("/register");
  }
}
