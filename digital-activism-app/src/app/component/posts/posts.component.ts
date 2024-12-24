import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {PostDTO} from '../../model/post/post-dto';
import {PostComponent} from '../post/post.component';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';
import {TokenService} from '../../service/token.service';
import {PostService} from '../../service/post/post.service';
import {CommunityDTO} from '../../model/community-dto';
import {NgForOf} from '@angular/common';
import {AddPostModalComponent} from './add-post-modal/add-post-modal.component';
import {ModalOpenType} from '../misc/modal-open-type';
import {PostRequest} from '../../model/post/post-request';
import {PUBLIC, Visibility} from '../../model/post/visibility';
import {CurrentMemberService} from '../../service/member/current-member.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    PostComponent,
    MatPaginator,
    NgForOf,
    AddPostModalComponent
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {

  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  posts: PostDTO[] = [];

  @Input() communityDTO!: CommunityDTO;

  isAddEditPostModalOpen: boolean = false;
  editingPostRequest!: PostRequest;

  constructor(private el: ElementRef,
              private postService: PostService,
              private currentMemberService: CurrentMemberService) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.postService.getTableLength(this.communityDTO.id!).subscribe({
      next: (response: number) => {
        this.length = response;
      },
      error: (error) => {
        console.error(error);
      }
    })

    this.fetchPosts(this.pageIndex, this.pageSize);
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.fetchPosts($event.pageIndex, $event.pageSize);
  }

  fetchPosts(pageIndex: number, pageSize: number) {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);
    fetchEntityLimited.optionalId = this.communityDTO.id;

    this.postService.fetchPostDTOSLimitedByCommunityId(fetchEntityLimited).then(
      (postDTOs: PostDTO[]) => {
        console.log(`Fetched ${postDTOs.length} posts`);
        postDTOs.sort((a, b) => {return a.id! - b.id!});
        this.posts = postDTOs;
      },
      (error) => {
        console.error(error);
      }
    )
  }

  addPostOnClick() {
    this.isAddEditPostModalOpen = true;
    this.editingPostRequest = new PostRequest("", "", PUBLIC.name, this.communityDTO.id, this.currentMemberService.memberDTO!.id);
  }

  onAddEditPostModalChange(newVal: boolean) {
    this.isAddEditPostModalOpen = newVal;
  }

  onPostAdded(postDTO: PostDTO) {
    this.posts.push(postDTO);
    this.length++;
  }
}
