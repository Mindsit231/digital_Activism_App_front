import {Component, OnInit} from '@angular/core';
import {exploreCommunities} from "../header/navigation-item";
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgForOf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CommunityDTO} from '../../model/community/community-dto';
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
  searchValue: string = "";

  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  communities: CommunityDTO[] = [];

  constructor(private communityService: CommunityService) {
  }

  ngOnInit(): void {
    this.fetchCommunities(this.pageIndex, this.pageSize);
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.fetchCommunities($event.pageIndex, $event.pageSize);
  }

  fetchCommunities(pageIndex: number, pageSize: number) {
    this.communityService.getTableLength(this.searchValue).subscribe({
      next: (response: number) => {
        this.length = response;

        let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex, this.searchValue);
        this.communityService.fetchCommunityDTOSLimited(fetchEntityLimited).then(
          (communitiesDTO: CommunityDTO[]) => {
            console.log(`Fetched ${communitiesDTO.length} communities`);
            communitiesDTO.sort((a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            this.communities = communitiesDTO;
          },
          (error) => {
            console.error(error);
          }
        )
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSearch() {
    this.fetchCommunities(this.pageIndex, this.pageSize);
  }
}
