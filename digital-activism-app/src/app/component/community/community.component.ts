import {Component, OnInit} from '@angular/core';
import {InternalObjectService} from '../../service/misc/internal-object.service';
import {CommunityDTO} from '../../model/community-dto';
import {getDateTime} from "../misc/functions";
import {RouterService} from '../../service/router.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatPaginator} from '@angular/material/paginator';
import {CommunityService} from '../../service/community.service';
import {PostsComponent} from '../posts/posts.component';
import {CampaignsComponent} from '../campaigns/campaigns.component';
import {InternalContainerService} from '../../service/misc/internal-container.service';
import {MembersComponent} from './members/members.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatPaginator,
    PostsComponent,
    CampaignsComponent,
    MembersComponent
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent implements OnInit {

  communityDTO!: CommunityDTO;

  constructor(private internalContainerService: InternalContainerService,
              protected routerService: RouterService,
              private communityService: CommunityService) {
  }

  ngOnInit(): void {
    this.communityDTO = this.internalContainerService.getCommunityDTO();
  }

  toggleJoin() {
    this.communityService.toggleJoin(this.communityDTO.id)
      .then((response: boolean) => {
        if (response) {
          this.communityDTO.toggleJoin();
        }
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }

  protected readonly getDateTime = getDateTime;
}
