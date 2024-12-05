import {Component, Input, OnInit} from '@angular/core';
import {PostDTO} from '../../model/post/post-dto';
import {PostComponent} from '../post/post.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    PostComponent
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {

  @Input() posts: PostDTO[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }
}
