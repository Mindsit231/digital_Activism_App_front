import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ModalComponent} from '../../../misc/modal-component';
import {RouterService} from '../../../../service/router.service';
import {FileService} from '../../../../service/misc/file.service';
import {CommunityService} from '../../../../service/community.service';
import {faCheck, faTrash, faXmark} from '@fortawesome/free-solid-svg-icons';
import {CommunityRequest} from '../../../../model/community/community-request';
import {CommunityDTO} from '../../../../model/community/community-dto';
import {generateRandomString, getFilesSize} from '../../../misc/functions';
import {UploadStatus} from '../../../misc/form-component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-add-community-modal',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgIf,
    PaginatorModule
  ],
  templateUrl: './add-community-modal.component.html',
  styleUrl: './add-community-modal.component.scss'
})
export class AddCommunityModalComponent extends ModalComponent {
  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>();
  @Output() onCommunityAddedEmitter = new EventEmitter<CommunityDTO>();

  private readonly maxSize: number = 100000000;

  banner!: File | undefined;
  logo!: File | undefined;

  logoStatusMsg: string = "";
  bannerStatusMsg: string = "";

  communityAdded: boolean = false;
  isFailure: boolean = false;
  isLogoSuccess: boolean = false;
  isBannerSuccess: boolean = false;

  @Input() communityRequest!: CommunityRequest;

  @ViewChild("logoInput") logoInput!: ElementRef;
  @ViewChild("bannerInput") bannerInput!: ElementRef;

  faXmark = faXmark;
  faTrash = faTrash;
  faCheck = faCheck;

  constructor(protected communityService: CommunityService,
              protected routerService: RouterService,
              protected override fileService: FileService) {
    super();
  }

  override isFormValid(): Promise<boolean> {
    let filesTypeChecked: boolean = true;

    if (this.banner != undefined && this.logo != undefined) {
      filesTypeChecked = this.banner.type == 'image/png' || this.banner.type == 'image/jpeg'
        && this.logo.type == 'image/png' || this.logo.type == 'image/jpeg';
    } else if (this.banner != undefined) {
      filesTypeChecked = this.banner.type == 'image/png' || this.banner.type == 'image/jpeg';
    } else if (this.logo != undefined) {
      filesTypeChecked = this.logo.type == 'image/png' || this.logo.type == 'image/jpeg';
    }

    return Promise.resolve(
      this.communityRequest.name.length > 0 &&
      this.communityRequest.description.length > 0 &&
      filesTypeChecked);
  }

  onAcceptClick() {
    console.log(this.communityRequest)

    this.isFormValid()
      .then((isValid: boolean) => {
        if (isValid) {

          this.uploadImages()
            .then((isSuccess: boolean) => {
              if (isSuccess) {
                this.communityService.addCommunity(this.communityRequest)
                  .then((communityDTO: CommunityDTO) => {
                    this.communityAdded = true;
                    this.closeModal();

                    this.onCommunityAddedEmitter.emit(communityDTO);
                  })
                  .catch((error: Error) => {
                    console.error(error);
                    this.isFailure = true;
                  })
              } else {
                this.isFailure = true;
              }
            });

        } else {
          this.bannerStatusMsg = "Invalid form data!";
        }
      })
  }

  uploadImages() {
    return new Promise<boolean>((resolve, reject) => {
      let formData = new FormData();

      if (this.logo != undefined || this.banner != undefined) {
        if (this.logo != undefined) formData.append('files', this.logo!, this.communityRequest.logoName);
        if (this.banner != undefined) formData.append('files', this.banner!, this.communityRequest.bannerName);
        this.uploadFiles(this.communityService, formData).subscribe({
          next: (uploadStatus: UploadStatus) => {
            this.logoStatusMsg = uploadStatus.statusMsg;
            this.bannerStatusMsg = uploadStatus.statusMsg;
            if (uploadStatus.isSuccessful && uploadStatus.isDone) {
              console.log("Successfully uploaded community images")
              resolve(true);
            } else if (!uploadStatus.isSuccessful && uploadStatus.isDone) {
              console.log("Failed to upload community images")
              resolve(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            resolve(false)
            console.error(error);
          }
        });
      } else {
        resolve(true);
      }

    })
  }

  private resetValues() {
    this.banner = undefined;
    this.logo = undefined;
  }

  override closeModal() {
    this.resetMessages();
    this.resetValues();
    super.closeModal();
  }

  private resetMessages() {
    this.bannerStatusMsg = "";
    this.logoStatusMsg = "";
  }

  checkIfCommunityAdded() {
    if (this.communityAdded) {
      this.resetMessages()
      this.communityAdded = false;
    }
  }

  isSuccess() {
    return this.isLogoSuccess && this.isBannerSuccess;
  }


  onLogoSelected(event: any) {
    if (getFilesSize(event.target.files) > this.maxSize) {
      this.logoStatusMsg = `Image size is too big! Max is 100MB`;
    } else {
      this.logo = event.target.files[0];
      this.communityRequest.logoName = `${generateRandomString(10)}-${this.logo!.name}`;
      this.communityRequest.logoUrl = URL.createObjectURL(this.logo!);
    }

    this.logoInput.nativeElement.value = "";
  }

  onBannerSelected(event: any) {
    if (getFilesSize(event.target.files) > this.maxSize) {
      this.bannerStatusMsg = `Image size is too big! Max is 100MB`;
    } else {
      this.banner = event.target.files[0];
      this.communityRequest.bannerName = `${generateRandomString(10)}-${this.banner!.name}`;
      this.communityRequest.bannerUrl = URL.createObjectURL(this.banner!);
    }

    this.bannerInput.nativeElement.value = "";
  }

  onDeleteLogo() {
    this.logo = undefined;
    this.communityRequest.logoName = "";
    this.communityRequest.logoUrl = "";
    this.logoInput.nativeElement.value = "";
  }

  onDeleteBanner() {
    this.banner = undefined;
    this.communityRequest.bannerName = "";
    this.communityRequest.bannerUrl = "";
    this.bannerInput.nativeElement.value = "";
  }
}
