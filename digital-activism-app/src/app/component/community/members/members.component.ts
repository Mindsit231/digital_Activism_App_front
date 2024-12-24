import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {CampaignWidgetComponent} from "../../campaigns/campaign-widget/campaign-widget.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf} from "@angular/common";
import {MemberWidgetComponent} from '../../member-widget/member-widget.component';
import {MemberService} from '../../../service/member/member.service';
import {CommunityDTO} from '../../../model/community-dto';
import {FetchEntityLimited} from '../../../model/misc/fetch-entity-limited';
import {MemberDTO} from '../../../model/member/member-dto';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    CampaignWidgetComponent,
    MatPaginator,
    NgForOf,
    MemberWidgetComponent
  ],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements OnInit {
  pageIndex: number = 0;
  length: number = 0;
  pageSize: number = 10;

  memberDTOS: MemberDTO[] = [];

  @Input() communityDTO!: CommunityDTO;

  constructor(private el: ElementRef,
              protected memberService: MemberService) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    this.fetchMembers(this.pageIndex, this.pageSize);
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.fetchMembers($event.pageIndex, $event.pageSize);
  }

  private fetchMembers(pageIndex: number, pageSize: number) {
    let fetchEntityLimited: FetchEntityLimited = new FetchEntityLimited(pageSize, pageIndex);
    fetchEntityLimited.optionalId = this.communityDTO.id;

    this.memberService.fetchMembersLimitedByCommunityId(fetchEntityLimited)
      .then((memberDTOS: MemberDTO[]) => {
        console.log(`Fetched ${memberDTOS.length} members`);
        memberDTOS.sort((a, b) => {
          return a.id! - b.id!
        });
        this.memberDTOS = memberDTOS;
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }
}
