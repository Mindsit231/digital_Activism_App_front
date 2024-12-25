import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {CampaignWidgetComponent} from "../campaigns/campaign-widget/campaign-widget.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {NgForOf} from "@angular/common";
import {MemberWidgetComponent} from './member-widget/member-widget.component';
import {MemberService} from '../../service/member/member.service';
import {CommunityDTO} from '../../model/community/community-dto';
import {MemberDTO} from '../../model/member/member-dto';
import {CampaignDTO} from '../../model/campaign/campaign-dto';

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
  @Input() campaignDTO!: CampaignDTO;

  @Input() fetchMembersAction!: (pageSize: number, pageIndex: number) => Promise<MemberDTO[]>;
  @Input() fetchMembersCountAction!: () => Promise<number>;

  constructor(private el: ElementRef,
              protected memberService: MemberService) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;

    console.log("init there")
    this.fetchMembersCountAction()
      .then((count: number) => {
        this.length = count;
      })
      .catch((error: Error) => {
        console.error(error);
      });

    this.fetchMembers();
  }

  handlePageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize;
    this.fetchMembers();
  }

  private fetchMembers() {
    this.fetchMembersAction(this.pageSize, this.pageIndex)
      .then((memberDTOS: MemberDTO[]) => {
        console.log(`Fetched ${memberDTOS.length} members`);
        this.memberDTOS = memberDTOS;
      })
      .catch((error: Error) => {
        console.error(error);
      })
  }
}
