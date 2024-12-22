import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environment/environment.prod";
import {Observable} from "rxjs";
import {TokenService} from '../token.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  protected apiBackendUrl = environment.apiBackendUrl;

  constructor(private http: HttpClient,
              protected tokenService: TokenService) {

  }

  public uploadFiles(formData: FormData, entityName: string): Observable<HttpEvent<string[]>> {
    return this.http.post<string[]>(
      `${this.apiBackendUrl}/authenticated/${entityName}/upload-files`,
      formData,
      {
        headers: this.tokenService.getAuthHeaders(),
        reportProgress: true,
        observe: 'events'
      })
  }

  public downloadFile(fileName: string, entityName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.http.get(
        `${this.apiBackendUrl}/authenticated/${entityName}/download-file`,
        {
          headers: this.tokenService.getAuthHeaders(),
          params: {
            fileName: fileName
          },
          reportProgress: true,
          observe: 'events',
          responseType: 'blob',
          // transferCache: {
          //   includeHeaders: ['Content-Type', 'File-Name', 'Content-Disposition']
          // }
        }).subscribe({
        next: (httpEvent: HttpEvent<Blob>) => {
          if (httpEvent.type === HttpEventType.Response) {
            const file: File = this.getFile(httpEvent);
            resolve(URL.createObjectURL(file));
          }
        },
        error: (error: HttpErrorResponse) => {
          reject(error);
        }
      })
    })

  }

  public deleteFile(fileName: string, entityName: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/${entityName}/delete-file`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          fileName: fileName
        }
      }
    );
  }

  public getFile(httpEvent: HttpResponse<Blob>) {
    return new File(
      [httpEvent.body!],
      httpEvent.headers.get('File-Name')!,
      {
        type: `${httpEvent.headers.get('Content-Type')};charset=utf-8`
      });
  }
}
