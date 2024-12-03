import {Observable} from "rxjs";
import {HttpClient, HttpEvent, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environment/environment.prod";
import {Injectable} from "@angular/core";
import {CommunityDTO} from '../model/community-dto';

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<T> {
  protected apiBackendUrl = environment.apiBackendUrl;
  protected readonly entityName: String;

  protected constructor(protected http: HttpClient, entityName: String) {
    this.entityName = entityName;
  }

  public uploadFiles(formData: FormData, token: string): Observable<HttpEvent<string[]>> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.post<string[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/upload-files`,
      formData,
      {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      })
  }

  public downloadFiles(fileName: string, token: string): Observable<HttpEvent<Blob>> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.get(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/download-file/${fileName}`,
      {
        headers: headers,
        reportProgress: true,
        observe: 'events',
        responseType: 'blob',
        // transferCache: {
        //   includeHeaders: ['Content-Type', 'File-Name', 'Content-Disposition']
        // }
      });
  }

  public deleteFile(fileName: string, token: string): Observable<boolean> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});

    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/delete-file/${fileName}`,
      {
        headers: headers
      }
    );
  }

  public findById(communityId: number, token: string): Observable<T> {
    const headers: HttpHeaders = new HttpHeaders({'Authorization': `Bearer ${token}`});
    return this.http.get<T>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/find-community-dto-by-id`,
      {
        headers: headers,
        params: {
          communityId: communityId.toString()
        }
      })
  }
}

