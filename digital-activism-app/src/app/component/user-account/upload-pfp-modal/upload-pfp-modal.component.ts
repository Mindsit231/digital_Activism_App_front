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
import {MemberService} from "../../../service/member.service";

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
export class UploadPfpModalComponent extends ModalComponent implements OnInit {
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

  @Input() memberSubject!: Subject<MemberDTO>;
  @Input() member!: MemberDTO;

  @ViewChild('imageInput') fileInput!: ElementRef;

  constructor(protected override memberService: MemberService) {
    super();
  }

  ngOnInit(): void {
    if(this.memberSubject !== undefined) this.memberSubject.subscribe({
      next: (member: MemberDTO) => {
        this.member = member;
      }
    });
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
    const newFileName = this.member.getPfpImgPrefix()! + this.file?.name;
    const formData = new FormData();
    formData.append('files', this.file!, newFileName);

    this.uploadFiles(this.memberService, formData).subscribe({
      next: (uploadStatus: UploadStatus) => {
        this.statusMsg = uploadStatus.statusMsg;
        if (uploadStatus.isSuccessful) {
          this.deleteOldPfpImg();
          this.updatePfpImgName(newFileName);
          this.member.setPfpUrl(this.imgUrl);
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

  private updatePfpImgName(newFileName: string) {
    this.memberService.updatePfpNameByEmail(
      {
        email: this.member.email!,
        pfpImgName: newFileName
      }
    ).subscribe({
      next: (response: number) => {
        console.log('Pfp img path updated: ', response);
        this.member.setPfpName(newFileName);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      }
    })
  }

  private deleteOldPfpImg() {
    if (this.member.pfpName == null || this.member.pfpName!.length == 0) return;
    this.memberService.deleteFile(this.member.pfpName!).subscribe({
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
    this.member.setPfpUrl("");
    this.updatePfpImgName("");
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

  getUserPfpImgUrl() {
    if (this.imgUrl.length > 0) {
      return this.imgUrl;
    } else if (this.member.hasPfp()) {
      return this.member.pfpImgUrl;
    } else {
      return "";
    }
  }

  internalHasUserPfpImg() {
    return this.getUserPfpImgUrl() != undefined && this.getUserPfpImgUrl()!.length > 0;
  }
}

