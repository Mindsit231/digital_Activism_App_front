import {Component, ElementRef, OnInit} from '@angular/core';
import {CommunityWidgetComponent} from "../../explore-communities/community-widget/community-widget.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf} from "@angular/common";
import {CommunityDTO} from '../../../model/community/community-dto';
import {CommunityService} from '../../../service/community.service';
import {FetchEntityLimited} from '../../../model/misc/fetch-entity-limited';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {AddCommunityModalComponent} from './add-community-modal/add-community-modal.component';
import {CommunityRequest} from '../../../model/community/community-request';
import {PostRequest} from '../../../model/post/post-request';
import {PUBLIC} from '../../../model/post/visibility';
import {PostDTO} from '../../../model/post/post-dto';
import {CurrentMemberService} from '../../../service/member/current-member.service';

@Component({
  selector: 'app-my-groups',
  standalone: true,
  imports: [
    CommunityWidgetComponent,
    MatPaginator,
    NgForOf,
    FaIconComponent,
    AddCommunityModalComponent
  ],
  templateUrl: './my-communities.component.html',
  styleUrl: './my-communities.component.scss'
})
export class MyCommunitiesComponent implements OnInit {

  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  communities: CommunityDTO[] = [];

  isAddCommunityModalOpen: boolean = false;
  editingCommunityRequest!: CommunityRequest;


  faPlus = faPlus;

  constructor(private el: ElementRef,
              private communityService: CommunityService,
              protected currentMemberService: CurrentMemberService) {

  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.communityService.fetchCommunitiesCountByMemberId()
      .then((count: number) => {
        this.length = count;
      })
      .catch((error: Error) => {
        console.error(error);
      })

    this.fetchCommunities(this.pageIndex, this.pageSize);
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.fetchCommunities($event.pageIndex, $event.pageSize);
  }

  private fetchCommunities(pageIndex: number, pageSize: number) {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);

    this.communityService.fetchCommunityDTOSLimitedByMemberId(fetchEntityLimited)
      .then((communities: CommunityDTO[]) => {
        console.log(`Fetched ${communities.length} communities`);
        communities.sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        this.communities = communities;
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }

  addCommunityOnClick() {
    this.isAddCommunityModalOpen = true;
    this.editingCommunityRequest = new CommunityRequest("", "", "", "", "", "");
  }

  onAddCommunityModalChange(newVal: boolean) {
    this.isAddCommunityModalOpen = newVal;
  }

  onCommunityAdded(communityDTO: CommunityDTO) {
    this.communities.unshift(communityDTO);
    this.length++;
  }
}
