import {Component, ElementRef, OnInit} from '@angular/core';
import {faCamera, faFloppyDisk, faPenToSquare, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {UploadPfpModalComponent} from "../upload-pfp-modal/upload-pfp-modal.component";
import {CookieService} from "ngx-cookie-service";
import {FooterHandlerComponent} from "../../misc/footer-handler-component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {MemberDTO} from "../../../model/member/member-dto";
import {MemberService} from "../../../service/member/member.service";
import {PaginatorModule} from "primeng/paginator";
import {Tag} from '../../../model/tag/tag';
import {RouterService} from '../../../service/router.service';
import {CurrentMemberService} from '../../../service/member/current-member.service';

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

  hasAddresses: boolean = false;
  isModalOpen: boolean = false;

  user!: MemberDTO;

  faUser = faUser;
  faCamera = faCamera;
  faPenToSquare = faPenToSquare;
  faFloppyDisk = faFloppyDisk;

  faXmark = faXmark;
  availableTags: Tag[] = [];
  selectedTagId!: string | undefined;

  constructor(protected el: ElementRef,
              protected memberService: MemberService,
              protected currentMemberService: CurrentMemberService,
              protected cookieService: CookieService,
              protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    // this.initializeMemberByToken().then(() => {
    //   this.loggedInPage();
    //
    //   this.user = this.currentMemberService.member!;
    //   this.tagService.getAllEntities().subscribe({
    //     next: (jsonTags: Tag[]) => {
    //       this.availableTags = Tag.initializeTags(jsonTags);
    //     },
    //     error: (error: HttpErrorResponse) => {
    //       console.error(error);
    //     }
    //   });
    // });
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal(newVal: boolean) {
    this.isModalOpen = newVal;
  }

  onTagSelected() {
    // if(this.selectedTagId != undefined) {
    //   let selectedTagId = parseInt(this.selectedTagId);
    //   if (!this.currentMemberService.member?.tagPerMemberList.find(tagPerMember => tagPerMember.tagId == selectedTagId) && this.selectedTagId != undefined) {
    //     let tagPerMember = new TagPerMember(selectedTagId, this.currentMemberService.member?.getMemberId()!);
    //     this.currentMemberService.member?.tagPerMemberList.push(tagPerMember);
    //   }
    // }
  }

  getSelectedTags(): Tag[] {
    // return this.availableTags.filter(tag => {
    //   return this.currentMemberService.member?.tagPerMemberList.find(tagPerMember => tag.tagId == tagPerMember.tagId) != undefined;
    // })
    // todo - fix this
    return [];
  }

  onDeleteTag(tag: Tag) {
    // this.selectedTagId = undefined;
    //
    // new Promise<boolean>((resolve, reject) => {
    //   let tagPerMember = this.currentMemberService.member?.tagPerMemberList.find(tagPerMember => tagPerMember.tagId == tag.tagId);
    //
    //   if(tagPerMember?.tagPerMemberId != undefined) {
    //     this.tagPerMemberService.deleteEntityById(tagPerMember?.tagPerMemberId!).subscribe({
    //       next: () => {
    //         console.log("Deleted tag per member with id: " + (tagPerMember?.tagPerMemberId!));
    //         resolve(true)
    //       },
    //       error: (error: HttpErrorResponse) => {
    //         resolve(false);
    //       }
    //     });
    //   } else {
    //     resolve(true);
    //   }
    // }).then((success: boolean) => {
    //   if(success) {
    //     this.currentMemberService.member?.tagPerMemberList.splice(this.currentMemberService.member?.tagPerMemberList
    //       .findIndex((tagPerMember: TagPerMember) => tagPerMember.tagId == tag.tagId), 1);
    //   }
    // });
  }

  saveOnClick() {
    // this.currentMemberService.member?.tagPerMemberList.forEach((tagPerMember: TagPerMember) => {
    //   if(tagPerMember.tagPerMemberId == undefined) {
    //
    //     this.tagPerMemberService.addEntity(tagPerMember).subscribe({
    //       next: (jsonTagPerMember: TagPerMember) => {
    //         tagPerMember.tagPerMemberId = jsonTagPerMember.tagPerMemberId;
    //         console.log("Added tag per post with id: " + tagPerMember.tagPerMemberId);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //         console.error(error);
    //       }
    //     });
    //   }
    // });
  }
}
