import {Injectable} from '@angular/core';
import {EntityService} from './entity.service';
import {PostDTO} from '../model/post/post-dto';

@Injectable({
  providedIn: 'root'
})
export class PostService extends EntityService<PostDTO> {

}
