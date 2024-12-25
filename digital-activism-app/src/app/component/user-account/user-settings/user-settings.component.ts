import {Component, ElementRef, OnInit} from '@angular/core';
import {faArrowRight, faCamera, faPenToSquare, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {UploadPfpModalComponent} from "../upload-pfp-modal/upload-pfp-modal.component";
import {CookieService} from "ngx-cookie-service";
import {FooterHandlerComponent} from "../../misc/footer-handler-component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {MemberService} from "../../../service/member/member.service";
import {PaginatorModule} from "primeng/paginator";
import {TagDTO} from '../../../model/tag/tag-dto';
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

  memberTags: TagDTO[] = [];

  faXmark = faXmark;
  tagProposal!: string | undefined;

  constructor(protected el: ElementRef,
              protected memberService: MemberService,
              protected currentMemberService: CurrentMemberService,
              protected cookieService: CookieService,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.memberService.fetchTagsByToken().subscribe({
      next: (tags: TagDTO[]) => {
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

  onDeleteTag(tag: TagDTO) {
    this.memberService.deleteTagByToken(tag).subscribe({
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
      this.memberService.proposeNewTag(this.tagProposal).subscribe({
        next: (jsonTag: TagDTO) => {
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
