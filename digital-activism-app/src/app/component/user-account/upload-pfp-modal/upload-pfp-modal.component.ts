import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgIf} from "@angular/common";
import {ModalComponent} from "../../misc/modal-component";
import {HttpErrorResponse} from "@angular/common/http";
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from "@angular/material/icon";
import {faCheck, faTrash, faUser, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UploadStatus} from "../../misc/form-component";
import {MemberDTO} from "../../../model/member/member-dto";
import {Subject} from "rxjs";
import {MemberService} from "../../../service/member/member.service";
import {PfpNameByEmail} from '../../../model/query/update/pfp-name-by-email';
import {TokenService} from '../../../service/token.service';

@Component({
  selector: 'app-upload-pfp-modal',
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    MatProgressBarModule,
    FaIconComponent
  ],
  templateUrl: './upload-pfp-modal.component.html',
  styleUrl: './upload-pfp-modal.component.scss'
})
export class UploadPfpModalComponent extends ModalComponent {
  file!: File | null;
  imgUrl: string = '';
  statusMsg: string = '';
  pfpImgChanged: boolean = false;

  faXmark = faXmark;
  faUser = faUser;
  faCheck = faCheck;
  faTrash = faTrash;

  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>()
  @Input() memberDTO!: MemberDTO;

  @ViewChild('imageInput') fileInput!: ElementRef;

  constructor(protected memberService: MemberService,
              protected override tokenService: TokenService) {
    super();
  }

  onPfpImgSelected(event: any) {
    this.file = event.target.files[0];
    if (this.file != null) this.imgUrl = URL.createObjectURL(this.file);
  }

  onSaveChanges(): void {
    if (!this.isFormValid()) {
      this.statusMsg = 'Invalid file type!';
      return;
    }
    const newFileName = this.memberDTO.getPfpImgPrefix()! + this.file?.name;
    const formData = new FormData();
    formData.append('files', this.file!, newFileName);

    this.uploadFiles(this.memberService, formData).subscribe({
      next: (uploadStatus: UploadStatus) => {
        this.statusMsg = uploadStatus.statusMsg;
        if (uploadStatus.isSuccessful) {
          this.deleteOldPfpImg();
          this.updatePfpName(newFileName);
          this.memberDTO.setPfpUrl(this.imgUrl);
          this.pfpImgChanged = true;
          this.resetValues();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    })
  }

  override isFormValid(): Promise<boolean> {
    return Promise.resolve(this.file != null && (this.file?.type == 'image/png' || this.file?.type == 'image/jpeg'));
  }

  private updatePfpName(newFileName: string) {
    let pfpNameByEmail = new PfpNameByEmail(this.memberDTO.email!, newFileName);

    this.memberService.updatePfpNameByEmail(pfpNameByEmail, this.tokenService.getUserToken()).subscribe({
      next: (response: number) => {
        console.log('Pfp img path updated: ', response);
        this.memberDTO.setPfpName(newFileName);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    })
  }

  private deleteOldPfpImg() {
    if (this.memberDTO.pfpName == null || this.memberDTO.pfpName!.length == 0) return;
    this.memberService.deleteFile(this.memberDTO.pfpName!, this.tokenService.getUserToken()).subscribe({
      next: (response: boolean) => {
        console.log('Old profile picture deleted: ', response);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    });
  }

  deleteImage() {
    this.deleteOldPfpImg();
    this.imgUrl = "";
    this.memberDTO.setPfpUrl("");
    this.updatePfpName("");
    this.pfpImgChanged = true;
  }

  resetValues() {
    this.fileInput.nativeElement.value = "";
    this.file = null;
  }

  override closeModal() {
    this.imgUrl = "";
    this.statusMsg = "";
    this.resetValues();
    super.closeModal();
  }

  getUserPfpImgUrl(): string {
    if(this.memberDTO !== undefined) {
      if (this.imgUrl.length > 0) {
        return this.imgUrl;
      } else if (this.memberDTO.hasPfp() && this.memberDTO.pfpUrl !== undefined) {
        return this.memberDTO.pfpUrl;
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  internalHasUserPfpImg() {
    return this.getUserPfpImgUrl() != undefined && this.getUserPfpImgUrl()!.length > 0;
  }
}

