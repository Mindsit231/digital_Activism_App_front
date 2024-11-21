import {Component, ElementRef, OnInit} from '@angular/core';
import {faArrowRight, faCamera, faPenToSquare, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {UploadPfpModalComponent} from "../upload-pfp-modal/upload-pfp-modal.component";
import {CookieService} from "ngx-cookie-service";
import {FooterHandlerComponent} from "../../misc/footer-handler-component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {MemberService} from "../../../service/member/member.service";
import {PaginatorModule} from "primeng/paginator";
import {Tag} from '../../../model/tag';
import {RouterService} from '../../../service/router.service';
import {CurrentMemberService} from '../../../service/member/current-member.service';
import {TokenService} from '../../../service/token.service';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    UploadPfpModalComponent,
    FaIconComponent,
    NgIf,
    NgForOf,
    PaginatorModule,
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent extends FooterHandlerComponent implements OnInit {

  isModalOpen: boolean = false;

  faUser = faUser;
  faCamera = faCamera;
  faPenToSquare = faPenToSquare;
  faArrowRight = faArrowRight;

  memberTags: Tag[] = [];

  faXmark = faXmark;
  tagProposal!: string | undefined;

  constructor(protected el: ElementRef,
              protected memberService: MemberService,
              protected currentMemberService: CurrentMemberService,
              protected tokenService: TokenService,
              protected cookieService: CookieService,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.memberService.fetchTagsByToken(this.tokenService.getUserToken()).subscribe({
      next: (tags: Tag[]) => {
        this.memberTags = tags;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(newVal: boolean) {
    this.isModalOpen = newVal;
  }

  onDeleteTag(tag: Tag) {
    this.memberService.deleteTagByToken(tag, this.tokenService.getUserToken()).subscribe({
      next: (isDeleted: boolean) => {
        if (isDeleted) {
          this.memberTags.splice(this.memberTags.indexOf(tag), 1);
        } else {
          console.error("Tag was not deleted");
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  saveOnClick() {
    if(this.tagProposal != null && this.tagProposal.length > 0) {
      this.memberService.proposeNewTag(this.tagProposal, this.tokenService.getUserToken()).subscribe({
        next: (jsonTag: Tag) => {
          if (jsonTag != null) {
            this.memberTags.push(jsonTag);
          } else {
            console.error("Tag is null");
          }
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.tagProposal = "";
        }
      });
    }
  }
}
