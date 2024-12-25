import {Injectable} from '@angular/core';
import {EntityService} from '../entity.service';
import {PostDTO} from '../../model/post/post-dto';
import {HttpClient} from '@angular/common/http';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';
import {Observable} from 'rxjs';
import {TokenService} from '../token.service';
import {PostVideoService} from './post-video.service';
import {PostImageService} from './post-image.service';
import {MemberService} from '../member/member.service';
import {PostRequest} from '../../model/post/post-request';
import {POST_ENTITY} from '../entity-names';

@Injectable({
  providedIn: 'root'
})
export class PostService extends EntityService<PostDTO> {

  constructor(http: HttpClient,
              protected override postVideoService: PostVideoService,
              protected override postImageService: PostImageService,
              public override memberService: MemberService,
              protected override tokenService: TokenService) {
    super(http, POST_ENTITY);
  }


  public fetchPostDTOSLimitedByCommunityId(fetchEntityLimited: FetchEntityLimited): Promise<PostDTO[]> {
    let postDTOObs: Observable<PostDTO[]> = this.http.post<PostDTO[]>(
      `${this.apiBackendUrl}/authenticated/${this.entityName}/fetch-posts-limited-by-community-id`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      }
    );
    return this.initializeDTOObss(postDTOObs, this.initializePostDTO);
  }

  public fetchPublicPostDTOSLimited(fetchEntityLimited: FetchEntityLimited): Promise<PostDTO[]> {
    let postDTOObs: Observable<PostDTO[]> = this.http.post<PostDTO[]>(
      `${this.apiBackendUrl}/public/${this.entityName}/fetch-public-posts-limited`,
      fetchEntityLimited,
      {
        headers: this.tokenService.getAuthHeaders()
      }
    );
    return this.initializeDTOObss(postDTOObs, this.initializePostDTO);
  }

  public fetchPublicPostsCount(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.http.get<number>(
        `${this.apiBackendUrl}/public/${this.entityName}/fetch-public-posts-count`
      ).subscribe({
        next: (count: number) => {
          resolve(count);
        },
        error: (error) => {
          reject(error);
        }
      })
    })
  }


  public addPost(postRequest: PostRequest): Promise<PostDTO> {
    return new Promise<PostDTO>((resolve, reject) => {
      this.http.post<PostDTO>(
        `${this.apiBackendUrl}/authenticated/community-admin/post/add`,
        postRequest,
        {
          headers: this.tokenService.getAuthHeaders()
        }
      ).subscribe({
        next: (postDTO: PostDTO) => {
          this.initializePostDTO(postDTO, {
            postVideoService: this.postVideoService,
            postImageService: this.postImageService,
            memberService: this.memberService
          })
            .then((postDTO: PostDTO) => {
              resolve(postDTO);
            })
            .catch((error: Error) => {
              reject(error);
            })
        },
        error: (error) => {
          reject(error);
        }
      })
    });

  }


  public initializePostDTO(postDTOJson: PostDTO,
                           options?: {
                             postVideoService?: PostVideoService,
                             postImageService?: PostImageService,
                             memberService?: MemberService
                           }): Promise<PostDTO> {
    return new Promise<PostDTO>((resolve, reject) => {
      let postDTO: PostDTO = PostDTO.fromJson(postDTOJson);
      let postVideoCount = 0;
      let postImageCount = 0;

      new Observable<PostDTO>((subscriber) => {
        if (options?.postVideoService == undefined) {
          reject(new Error("PostVideoService is undefined"));
        }
        if (postDTO.postVideoDTOS.length > 0) {
          postDTO.postVideoDTOS.forEach(postVideoDTO => {
            options?.postVideoService?.initializePostVideoDTO(postVideoDTO)
              .then((success: boolean) => {
                if (success) postVideoCount++;
                subscriber.next(postDTO);
              })
              .catch((error: Error) => {
                reject(error);
              })
          })
        } else {
          subscriber.next(postDTO);
        }

        if (postDTO.postImageDTOS.length > 0) {
          if (options?.postImageService == undefined) {
            reject(new Error("PostImageService is undefined"));
          }
          postDTO.postImageDTOS.forEach(postImageDTO => {
            options?.postImageService?.initializePostImageDTO(postImageDTO)
              .then((success: boolean) => {
                if (success) postImageCount++;
                subscriber.next(postDTO);
              })
              .catch((error: Error) => {
                reject(error);
              })
          })
        } else {
          subscriber.next(postDTO);
        }

        if (postDTO.memberDTO.pfpName != undefined) {
          if (options?.memberService == undefined) {
            reject(new Error("MemberService is undefined"));
          }
          options?.memberService?.getMemberPfpUrl(postDTO.memberDTO.pfpName)
            .then((pfpUrl: string | undefined) => {
              postDTO.memberDTO.pfpUrl = pfpUrl;
              subscriber.next(postDTO);
            })
            .catch((error: Error) => {
              reject(error);
            })
        } else {
          subscriber.next(postDTO);
        }

      }).subscribe({
        next: (postDTO: PostDTO) => {
          if (
            postVideoCount === postDTO.postVideoDTOS.length
            && postImageCount === postDTO.postImageDTOS.length
            && (postDTO.memberDTO.pfpName == undefined || postDTO.memberDTO.pfpUrl != undefined)) {
            resolve(postDTO);
          }
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    })
  }

  public toggleLikeRequest(postId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiBackendUrl}/authenticated/post/toggle-like`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          postId: postId.toString()
        }
      });
  }

  public toggleLike(postId: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.toggleLikeRequest(postId).subscribe({
        next: (response: boolean) => {
          resolve(response);
        },
        error: (error) => {
          console.error(error);
          resolve(false);
        }
      });
    })
  }

  public getTableLength(communityId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiBackendUrl}/authenticated/post/get-table-length-by-community-id`,
      {
        headers: this.tokenService.getAuthHeaders(),
        params: {
          communityId: communityId.toString()
        }
      });
  }
}
