import {Component, OnInit} from '@angular/core';
import {InternalObjectService} from '../../service/misc/internal-object.service';
import {CommunityDTO} from '../../model/community-dto';
import {StorageKeys} from '../misc/storage-keys';
import {ActivatedRoute} from '@angular/router';
import {getDateTime} from "../misc/functions";
import {RouterService} from '../../service/router.service';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {CommunityService} from '../../service/community.service';
import {TokenService} from '../../service/token.service';
import {PostsComponent} from '../posts/posts.component';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    MatPaginator,
    PostsComponent
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss'
})
export class CommunityComponent implements OnInit {

  communityDTO!: CommunityDTO;

  constructor(private internalObjectService: InternalObjectService<CommunityDTO>,
              protected routerService: RouterService,
              private communityService: CommunityService,
              private tokenService: TokenService) {
  }
  ngOnInit(): void {
    this.communityDTO = this.internalObjectService.getObject();
    if(this.communityDTO == null) {
    }
    console.log(this.communityDTO);
  }
  protected readonly getDateTime = getDateTime;

  toggleJoin() {
    this.communityService.toggleJoin(this.communityDTO.id, this.tokenService.getUserToken()).then((response: boolean) => {
      if (response) {
        this.communityDTO.joined = !this.communityDTO.joined;
      }
    });
  }
}
