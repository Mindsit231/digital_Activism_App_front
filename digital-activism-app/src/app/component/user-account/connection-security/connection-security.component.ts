import {Component, ElementRef, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ConnectionSecurityFieldComponent} from "./connection-security-field/connection-security-field.component";
import {FooterComponent} from "../../footer/footer.component";
import {CookieService} from "ngx-cookie-service";
import {CurrentMemberService} from "../../../service/member/current-member.service";
import {MemberDTO} from "../../../model/member/member-dto";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {ConnectionSecurityElementComponent} from "./connection-security-element/connection-security-element.component";
import {FooterHandlerComponent} from "../../misc/footer-handler-component";
import {MemberService} from "../../../service/member/member.service";
import {AuthenticationService} from '../../../service/authentication.service';

@Component({
  selector: 'app-connection-security',
  standalone: true,
  imports: [
    NgForOf,
    ConnectionSecurityFieldComponent,
    FooterComponent,
    NgIf,
    NgxResizeObserverModule,
    ConnectionSecurityElementComponent
  ],
  templateUrl: './connection-security.component.html',
  styleUrl: './connection-security.component.scss'
})
export class ConnectionSecurityComponent extends FooterHandlerComponent implements OnInit {
  user!: MemberDTO;

  constructor(private el: ElementRef,
              protected memberService: MemberService,
              protected currentMemberService: CurrentMemberService,
              protected authenticationService: AuthenticationService,
              protected cookieService: CookieService) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
    this.user = this.currentMemberService.member!;
  }
}
