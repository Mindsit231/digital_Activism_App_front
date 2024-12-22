import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {faArrowRight, faCheck, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ModalComponent} from "../../misc/modal-component";
import {generateRandomString} from "../../misc/functions";
import {PostDTO} from '../../../model/post/post-dto';
import {RouterService} from '../../../service/router.service';
import {PostRequest} from '../../../model/post/post-request';
import {PostImageRequest} from '../../../model/post/post-image-request';
import {PostVideoRequest} from '../../../model/post/post-video-request';
import {PostService} from '../../../service/post/post.service';
import {UploadStatus} from '../../misc/form-component';
import {HttpErrorResponse} from '@angular/common/http';
import {PostVideoService} from '../../../service/post/post-video.service';
import {PostImageService} from '../../../service/post/post-image.service';
import {Observable} from 'rxjs';
import {FileService} from '../../../service/misc/file.service';

@Component({
  selector: 'app-add-edit-tweet-modal',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './add-edit-post-modal.component.html',
  styleUrl: './add-edit-post-modal.component.scss'
})
export class AddEditPostModalComponent extends ModalComponent implements OnInit {
  @Input() override isModalOpen = false
  @Output() override onModalChangeEmitter = new EventEmitter<boolean>();
  @Output() onPostAddedEmitter = new EventEmitter<PostDTO>();

  private readonly maxSize: number = 100000000;
  private readonly maxImages: number = 4;
  private readonly maxVideos: number = 2;

  tagProposal!: string | undefined;

  faXmark = faXmark;
  faCheck = faCheck;

  images: File[] = [];
  videos: File[] = [];

  imagesStatusMsg: string = "";
  videosStatusMsg: string = "";

  isImagesSuccess: boolean = false;
  isVideosSuccess: boolean = false;

  isPostAdded: boolean = false;

  isFailure: boolean = false;

  faTrash = faTrash;

  @Input() postRequest!: PostRequest;
  @ViewChild("videoInput") videoInput!: ElementRef;

  @ViewChild("imageInput") imageInput!: ElementRef;

  constructor(protected postService: PostService,
              protected postImageService: PostImageService,
              protected postVideoService: PostVideoService,
              protected routerService: RouterService,
              protected override fileService: FileService) {
    super();
  }

  ngOnInit(): void {

  }

  override isFormValid(): Promise<boolean> {
    let checkedFileTypes: boolean = true;

    for (let i = 0; i < this.images.length; i++) {

      checkedFileTypes = this.images[i].type == 'image/png' || this.images[i].type == 'image/jpeg';
      if (!checkedFileTypes) break;
    }
    return Promise.resolve(this.postRequest.title.length > 0 && this.postRequest.content.length > 0 && checkedFileTypes);
  }

  getFilesSize(files: File[]): number {
    let size = 0;

    for (let i = 0; i < files.length; i++) {
      size += files[i].size;
    }

    console.log(size)
    return size;
  }

  onImageSelected(event: any) {
    if ((this.images.length + event.target.files.length) > this.maxImages) {
      this.imagesStatusMsg = `You can only upload ${this.maxImages} images!`;
    } else if (this.getFilesSize(this.images) + this.getFilesSize(event.target.files) > this.maxSize) {
      this.imagesStatusMsg = `Image size is too big! Max is 100MB`;
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        this.images.push(event.target.files[i]);
        let name = `${generateRandomString(10)}-${i}-${this.images[i].name}`

        let postImage = new PostImageRequest(name, this.images[i].name);
        postImage.imageUrl = URL.createObjectURL(event.target.files[i]);

        this.postRequest.postImageRequests.push(postImage);
      }
    }

    this.imageInput.nativeElement.value = "";
  }

  onVideoSelected(event: any) {
    if (this.videos.length + event.target.files.length > this.maxVideos) {
      this.videosStatusMsg = `You can only upload ${this.maxVideos} videos!`;
    } else if (this.getFilesSize(this.videos) + this.getFilesSize(event.target.files) > this.maxSize) {
      this.videosStatusMsg = `Video size is too big! Max is 100MB`;
    } else {
      for (let i = 0; i < event.target.files.length; i++) {
        console.log(event.target.files[i])

        this.videos.push(event.target.files[i]);
        let name = `${generateRandomString(10)}-${i}-${this.videos[i].name}`

        let postVideo = new PostVideoRequest(name, this.videos[i].name);
        postVideo.videoUrl = URL.createObjectURL(event.target.files[i]);

        this.postRequest.postVideoRequests.push(postVideo);
      }
    }

    this.videoInput.nativeElement.value = "";
  }

  onAcceptClick() {
    if (!this.isFormValid()) {
      this.imagesStatusMsg = "Invalid form data!";
      return;
    }

    new Observable((observer) => {
      this.uploadPostImages()
        .then((isSuccess: boolean) => {
          this.isImagesSuccess = isSuccess;
          observer.next();
        });

      this.uploadPostVideos()
        .then((isSuccess: boolean) => {
          this.isVideosSuccess = isSuccess;
          observer.next();
        });
    }).subscribe({
      next: () => {
        if(this.isImagesSuccess && this.isVideosSuccess) {
          this.postService.addPost(this.postRequest)
            .then((postDTO: PostDTO) => {
              this.isPostAdded = true;
              this.closeModal();

              this.onPostAddedEmitter.emit(postDTO)
            })
            .catch((error: Error) => {
              console.log(error)
              this.isFailure = true;
            })
        }
      }
    })
  }

  uploadPostImages() {
    return new Promise<boolean>((resolve, reject) => {
      let formData = new FormData();

      for (let i = 0; i < this.images.length; i++) {
        let postImageRequest = this.postRequest.postImageRequests
          .find((postImageRequest: PostImageRequest) => postImageRequest.originalName === this.images[i].name)!;

        formData.append('files', this.images[i], postImageRequest.name);
      }

      if (this.images.length > 0) {
        this.uploadFiles(this.postImageService, formData).subscribe({
          next: (uploadStatus: UploadStatus) => {
            this.imagesStatusMsg = uploadStatus.statusMsg;
            if (uploadStatus.isSuccessful && uploadStatus.isDone) {
              console.log("Successfully uploaded post images")
              resolve(true);
            } else if (!uploadStatus.isSuccessful && uploadStatus.isDone) {
              console.log("Failed to upload post images")
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


  uploadPostVideos() {
    return new Promise<boolean>((resolve, reject) => {
      let formData = new FormData();

      for (let i = 0; i < this.videos.length; i++) {
        let postVideoRequest = this.postRequest.postVideoRequests
          .find((postVideoRequest: PostVideoRequest) => postVideoRequest.originalName === this.videos[i].name)!;

        formData.append('files', this.videos[i], postVideoRequest.name);
      }

      if (this.videos.length > 0) {
        this.uploadFiles(this.postVideoService, formData).subscribe({
          next: (uploadStatus: UploadStatus) => {
            this.videosStatusMsg = uploadStatus.statusMsg;
            if (uploadStatus.isSuccessful && uploadStatus.isDone) {
              resolve(true);
              console.log("Successfully uploaded post videos")
            } else if (!uploadStatus.isSuccessful && uploadStatus.isDone) {
              resolve(false);
              console.log("Failed to upload post videos")
            }
          },
          error: (error: HttpErrorResponse) => {
            resolve(false);
            console.error(error);
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  onDeleteTag(tagToDelete: string) {
    this.postRequest.tagList.splice(this.postRequest.tagList
      .findIndex((tag: string) => tag == tagToDelete), 1);
  }

  onDeleteImage(postImageRequestToDelete: PostImageRequest) {
    // REMOVE FROM POST IMAGES
    this.postRequest?.postImageRequests.splice(this.postRequest?.postImageRequests
      .findIndex((postImageRequest: PostImageRequest) =>
        postImageRequest.imageUrl == postImageRequestToDelete.imageUrl), 1);

    // REMOVE FROM FILES
    let indexFiles = this.images.findIndex((file: File) =>
      URL.createObjectURL(file) == postImageRequestToDelete.imageUrl);
    this.images.splice(indexFiles, 1);
  }

  onDeleteVideo(postVideoRequestToDelete: PostVideoRequest) {
    // REMOVE FROM POST IMAGES
    this.postRequest?.postVideoRequests.splice(this.postRequest?.postVideoRequests
      .findIndex((postVideoRequest: PostVideoRequest) =>
        postVideoRequest.videoUrl == postVideoRequestToDelete.videoUrl), 1);

    // REMOVE FROM FILES
    let indexFiles = this.videos.findIndex((file: File) =>
      URL.createObjectURL(file) == postVideoRequestToDelete.videoUrl);
    this.videos.splice(indexFiles, 1);
  }

  private resetValues() {
    this.images = [];
    this.videos = [];
  }

  override closeModal() {
    this.resetMessages();
    this.resetValues();
    super.closeModal();
  }

  isSuccess() {
    return this.isImagesSuccess && this.isVideosSuccess;
  }

  checkIfPostAdded() {
    if (this.isPostAdded) {
      this.resetMessages()
      this.isPostAdded = false;
    }
  }

  private resetMessages() {
    this.imagesStatusMsg = "";
    this.videosStatusMsg = "";
    this.isImagesSuccess = false;
    this.isVideosSuccess = false;
  }

  protected readonly faArrowRight = faArrowRight;

  onAddTag() {
    if (this.tagProposal != null) {
      this.postRequest.tagList.push(this.tagProposal)
      this.tagProposal = ""
    }
  }
}
