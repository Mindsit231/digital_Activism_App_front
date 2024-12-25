import {Injectable} from '@angular/core';
import {EntityService} from '../entity.service';
import {HttpClient} from '@angular/common/http';
import {PostImageDTO} from '../../model/post/post-image-dto';
import {FileService} from '../misc/file.service';
import {POST_IMAGE_ENTITY} from '../entity-names';

@Injectable({
  providedIn: 'root'
})
export class PostImageService extends EntityService<PostImageDTO> {

  constructor(http: HttpClient,
              protected override fileService: FileService) {
    super(http, POST_IMAGE_ENTITY);
  }

  public initializePostImageDTO(postImageDTO: PostImageDTO): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.fileService.downloadFile(postImageDTO.name, this.entityName, false)
        .then((imageUrl: string) => {
          postImageDTO.imageUrl = imageUrl;
          resolve(true);
        })
        .catch((error: Error) => {
          reject(error);
        })
    })
  }
}
