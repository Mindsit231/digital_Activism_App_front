import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  protected router: Router = inject(Router);
  protected route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
  }

  routeToHome(): Promise<boolean> {
    return this.router.navigate(['/home'], {relativeTo: this.route});
  }

  routeTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route}).then();
  }

  isCurrentUrlRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  getRouterUrl(): string {
    return this.router.url;
  }

  routeToLogin() {
    return this.router.navigate(['/login'], {relativeTo: this.route});
  }
}
