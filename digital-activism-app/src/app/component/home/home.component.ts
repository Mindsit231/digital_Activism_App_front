import {Component, ElementRef, OnInit} from '@angular/core';
import {FooterHandlerComponent} from "../misc/footer-handler-component";
import {NgxResizeObserverModule} from "ngx-resize-observer";
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {PostComponent} from "../post/post.component";
import {PostService} from '../../service/post/post.service';
import {PostDTO} from '../../model/post/post-dto';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgxResizeObserverModule,
    FooterComponent,
    NgForOf,
    NgIf,
    MatProgressBarModule,
    MatPaginator,
    PostComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends FooterHandlerComponent implements OnInit {

  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  posts: PostDTO[] = [];

  constructor(private el: ElementRef,
              protected postService: PostService) {
    super();
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.postService.fetchPublicPostsCount()
      .then((count: number) => {
        this.length = count;
      })
      .catch((error: Error) => {
        console.error(error);
      })

    this.fetchPosts(this.pageIndex, this.pageSize);
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.fetchPosts($event.pageIndex, $event.pageSize);
  }

  fetchPosts(pageIndex: number, pageSize: number) {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);

    this.postService.fetchPublicPostDTOSLimited(fetchEntityLimited).then(
      (postDTOs: PostDTO[]) => {
        console.log(`Fetched ${postDTOs.length} posts`);
        this.posts = postDTOs;
      },
      (error) => {
        console.error(error);
      }
    )
  }
}
