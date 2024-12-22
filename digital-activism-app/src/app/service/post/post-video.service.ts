import {Injectable} from '@angular/core';
import {EntityService} from '../entity.service';
import {HttpClient} from '@angular/common/http';
import {PostVideoDTO} from '../../model/post/post-video-dto';
import {FileService} from '../misc/file.service';
import {POST_VIDEO_ENTITY} from '../entity-names';

@Injectable({
  providedIn: 'root'
})
export class PostVideoService extends EntityService<PostVideoDTO> {

  constructor(http: HttpClient,
              protected override fileService: FileService) {
    super(http, POST_VIDEO_ENTITY);
  }


  public initializePostVideoDTO(postVideoDTO: PostVideoDTO): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fileService.downloadFile(postVideoDTO.name, this.entityName)
        .then((videoUrl: string) => {
          postVideoDTO.videoUrl = videoUrl;
          resolve(true);
        })
        .catch((error: Error) => {
        reject(error);
      })
    })
  }
}
