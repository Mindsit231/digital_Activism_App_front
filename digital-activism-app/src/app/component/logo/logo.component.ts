import {Component, ElementRef, OnInit} from '@angular/core';
import {RouterService} from '../../service/router.service';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit {
  constructor(protected routerService: RouterService,
              private el: ElementRef) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.width = `100%`;
  }
}
