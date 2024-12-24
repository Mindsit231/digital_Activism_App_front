import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {MemberDTO} from '../../model/member/member-dto';

@Component({
  selector: 'app-member-widget',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf
  ],
  templateUrl: './member-widget.component.html',
  styleUrl: './member-widget.component.scss'
})
export class MemberWidgetComponent implements OnInit {

  @Input() memberDTO!: MemberDTO;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }

  protected readonly faUser = faUser;
}
