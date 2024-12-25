import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment.prod";
import {Injectable} from "@angular/core";
import {FileService} from './misc/file.service';
import {TokenService} from './token.service';
import {PostImageService} from './post/post-image.service';
import {PostVideoService} from './post/post-video.service';
import {MemberService} from './member/member.service';

@Injectable({
  providedIn: 'root'
})
export abstract class EntityService<T> {
  protected apiBackendUrl = environment.apiBackendUrl;
  public readonly entityName: string;

  protected fileService!: FileService;
  protected tokenService!: TokenService;

  protected postImageService!: PostImageService;
  protected postVideoService!: PostVideoService;

  public memberService!: MemberService;

  protected constructor(protected http: HttpClient, entityName: string) {
    this.entityName = entityName;
  }

  public initializeDTOObss(DTOObss: Observable<T[]>,
                           initializeDTO: (DTOJson: T,
                                           options?: {
                                             fileService: FileService,
                                             tokenService: TokenService,
                                             entityName: string,
                                             postImageService?: PostImageService,
                                             postVideoService?: PostVideoService,
                                             memberService?: MemberService
                                           }) => Promise<T>): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      let DTOs: T[] = [];

      DTOObss.subscribe({
        next: (DTOsJson: T[]) => {
          DTOsJson.forEach(DTOJson => {
            initializeDTO(DTOJson, {
              fileService: this.fileService,
              tokenService: this.tokenService,
              entityName: this.entityName,
              postImageService: this.postImageService,
              postVideoService: this.postVideoService,
              memberService: this.memberService,
            })
              .then((DTOInitialized: T) => {
                DTOs.push(DTOInitialized);
                if (DTOs.length === DTOsJson.length) {
                  resolve(DTOs);
                }
              })
              .catch((error: Error) => {
                reject(error);
              })
          })
        },
        error: (error: Error) => {
          reject(error);
        }
      })
    })
  }

  public initializeDTOObs(DTOObs: Observable<T>,
                          initializeDTO: (DTOJson: T,
                                          options?: {
                                            fileService: FileService,
                                            tokenService: TokenService,
                                            entityName: string,
                                            postImageService?: PostImageService,
                                            postVideoService?: PostVideoService,
                                            memberService?: MemberService
                                          }) => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => [
      DTOObs.subscribe({
        next: (DTOJson: T) => {
          initializeDTO(DTOJson, {
            fileService: this.fileService,
            tokenService: this.tokenService,
            entityName: this.entityName,
            postImageService: this.postImageService,
            postVideoService: this.postVideoService,
            memberService: this.memberService
          })
            .then(
              (DTO: T) => {
                resolve(DTO);
              })
            .catch((error: Error) => {
              reject(error);
            })
        },
        error: (error: Error) => {
          reject(error);
        }
      })
    ])
  }
}

