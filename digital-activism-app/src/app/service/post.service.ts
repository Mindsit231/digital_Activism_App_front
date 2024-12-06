import {Injectable} from '@angular/core';
import {EntityService} from './entity.service';
import {PostDTO} from '../model/post/post-dto';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService extends EntityService<PostDTO> {

  constructor(http: HttpClient) {
    super(http, "post");
  }

}
