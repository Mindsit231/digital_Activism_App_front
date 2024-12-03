import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {CommunityDTO} from '../../../model/community-dto';
import {getDateTime} from '../../misc/functions';
import {CommunityService} from '../../../service/community.service';
import {TokenService} from '../../../service/token.service';

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
              private communityService: CommunityService,
              private tokenService: TokenService) {
  }


  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }

  toggleJoin() {
    this.communityService.toggleJoin(this.communityDTO.id, this.tokenService.getUserToken()).subscribe({
      next: (response: boolean) => {
        this.communityDTO.joined = response;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  protected readonly getDateTime = getDateTime;
}
