import {Component, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NgIf} from "@angular/common";
import {HeaderComponent} from "../header/header.component";
import {FooterHandlerComponent} from "../misc/footer-handler-component";
import {RouterService} from '../../service/router.service';

@Component({
  selector: 'main-component',
  standalone: true,
  imports: [RouterOutlet, NgIf, HeaderComponent, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent extends FooterHandlerComponent implements OnInit {
  // Excluded Routes for headers / footers
  excludedHeaderRoutes = ['/login', '/register', '/password-recovery', '/password-reset/', '/verify-email'];

  constructor(protected routerService: RouterService) {
    super();
  }

  ngOnInit(): void {
  }

  isNotExcludedHeaderRoute(): boolean {
    for (let i = 0; i < this.excludedHeaderRoutes.length; i++) {
      if (this.routerService.isCurrentUrlRoute(this.excludedHeaderRoutes[i])) {
        return false;
      }
    }
    return true;
  }
}
