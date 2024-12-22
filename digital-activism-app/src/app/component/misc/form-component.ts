import {FooterHandlerComponent} from "./footer-handler-component";
import {HttpErrorResponse, HttpEvent, HttpEventType} from "@angular/common/http";
import {Observable} from "rxjs";
import {EntityService} from "../../service/entity.service";
import {TokenService} from '../../service/token.service';
import {FileService} from '../../service/misc/file.service';

export abstract class FormComponent extends FooterHandlerComponent {
  protected isSubmitted: boolean = false;
  protected formValidated: boolean = false;

  protected fileService!: FileService;

  protected constructor() {
    super();
  }

  onSubmit() {
    this.isSubmitted = true;
  };

  isFormValid(): Promise<boolean> {
    return Promise.resolve(false);
  };

  protected uploadFiles(entityService: EntityService<any>, formData: FormData): Observable<UploadStatus> {
    return new Observable<UploadStatus>(subscriber => {
      this.fileService.uploadFiles(formData, entityService.entityName).subscribe({
        next: (httpEvent: HttpEvent<string[]>) => {
          switch (httpEvent.type) {
            case HttpEventType.ResponseHeader:
              break;
            case HttpEventType.Response:
              subscriber.next(new UploadStatus('Your file(s) have been uploaded successfully!', true, true));
              break;
            case HttpEventType.Sent:
              subscriber.next(new UploadStatus('Uploading...', true, false));
              break;
            default:
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log("Error uploading file: ", error);
          subscriber.next(new UploadStatus('An error occurred while uploading your file(s).', false, false));
        }
      });
    });
  }
}

export class UploadStatus {
  statusMsg: string = '';
  isSuccessful: boolean = false;
  isDone: boolean = false;

  constructor(statusMessage: string, isSuccessful: boolean, isDone: boolean = true) {
    this.statusMsg = statusMessage;
    this.isSuccessful = isSuccessful;
    this.isDone = isDone;
  }
}


