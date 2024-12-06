import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environment/environment.prod";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileService {
  protected apiBackendUrl = environment.apiBackendUrl;

  constructor(private http: HttpClient) {

  }

  public uploadFiles(formData: FormData, token: string, entityName: string): Observable<HttpEvent<string[]>> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.post<string[]>(
      `${this.apiBackendUrl}/authenticated/${entityName}/upload-files`,
      formData,
      {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      })
  }

  public downloadFiles(fileName: string, token: string, entityName: string): Promise<string> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return new Promise<string>((resolve, reject) => {
      this.http.get(
        `${this.apiBackendUrl}/authenticated/${entityName}/download-file/${fileName}`,
        {
          headers: headers,
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

  public deleteFile(fileName: string, token: string, entityName: string): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/${entityName}/delete-file/${fileName}`,
      {
        headers: headers
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
