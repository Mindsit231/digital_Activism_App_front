import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {CommunityDTO} from '../../../model/community/community-dto';
import {getDateTime} from '../../misc/functions';
import {CommunityService} from '../../../service/community.service';
import {TokenService} from '../../../service/token.service';
import {RouterService} from '../../../service/router.service';

@Component({
  selector: 'app-community-widget',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './community-widget.component.html',
  styleUrl: './community-widget.component.scss'
})
export class CommunityWidgetComponent implements OnInit {
  @Input() communityDTO!: CommunityDTO;

  constructor(private el: ElementRef,
              protected communityService: CommunityService,
              protected routerService: RouterService) {
  }


  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }

  protected readonly getDateTime = getDateTime;

  toggleJoin() {
    this.communityService.toggleJoin(this.communityDTO.id).then((response: boolean) => {
      if (response) {
        this.communityDTO.toggleJoin();
      }
    });
  }
}
