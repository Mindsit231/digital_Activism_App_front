import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {CommunityDTO} from '../../../model/community-dto';

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
  @Input() community!: CommunityDTO;

  constructor(private el: ElementRef) {

  }


  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }
}
