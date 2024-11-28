import {Component, OnInit} from '@angular/core';
import {exploreCommunities} from "../header/navigation-item";
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CommunityDTO} from '../../model/community-d-t-o';
import {CommunityWidgetComponent} from './community-widget/community-widget.component';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {CommunityService} from '../../service/community.service';
import {TokenService} from '../../service/token.service';
import {FetchEntityLimited} from '../../model/misc/fetch-entity-limited';

@Component({
  selector: 'app-explore-communities',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    FormsModule,
    CommunityWidgetComponent,
    MatPaginator
  ],
  templateUrl: './explore-communities.component.html',
  styleUrl: './explore-communities.component.scss'
})
export class ExploreCommunitiesComponent implements OnInit {

  protected readonly exploreCommunities = exploreCommunities;
  searchString: string = "";
  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  communities: CommunityDTO[] = [];

  constructor(private communityService: CommunityService,
              private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.communityService.getTableLength(this.tokenService.getUserToken()).subscribe({
      next: (response: number) => {
        this.length = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.fetchCommunities(this.pageIndex, this.pageSize);
  }


  getCommunities(): CommunityDTO[] {
    return [
      new Community(1, "CommunityDto 1", "Desc 1", "", "", 1, ""),
      new Community(2, "CommunityDto 2", "Desc 2", "", "", 1, ""),
      new Community(3, "CommunityDto 3", "Desc 3", "", "", 1, ""),
      new Community(4, "CommunityDto 4", "Desc 4", "", "", 1, ""),
      new Community(5, "CommunityDto 5", "Desc 5", "", "", 1, ""),
      new Community(6, "CommunityDto 6", "Desc 6", "", "", 1, ""),
    ];
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.fetchCommunities($event.pageIndex, $event.pageSize);
  }

  fetchCommunities(pageIndex: number, pageSize: number) {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex * pageSize);
    this.communityService.fetchCommunitiesLimited(fetchEntityLimited, this.tokenService.getUserToken()).subscribe({
      next: (communities: CommunityDTO[]) => {
        console.log(`Fetched ${communities.length} communities`);
        this.communities = communities;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
