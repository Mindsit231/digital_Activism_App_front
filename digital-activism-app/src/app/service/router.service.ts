import {inject, Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  campaignRoute,
  communityRoute,
  connectionSecurityRoute,
  homeRoute,
  loginRoute,
  passwordRecoveryRoute,
  registerRoute,
  userAccountRoute,
  userSettingsRoute,
  verifyEmailRoute
} from '../app.routes';

@Injectable({
  providedIn: 'root'
})
export class RouterService {
  protected router: Router = inject(Router);
  protected route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
  }

  routeToHome(): Promise<boolean> {
    return this.router.navigate([`/${homeRoute}`], {relativeTo: this.route});
  }

  routeTo(path: string) {
    this.router.navigate([path], {relativeTo: this.route}).then();
  }

  isCurrentUrlRoute(route: string): boolean {
    return this.router.url.endsWith(route);
  }

  getRouterUrl(): string {
    return this.router.url;
  }

  routeToLogin() {
    return this.router.navigate([`/${loginRoute}`], {relativeTo: this.route});
  }

  routeToPasswordRecovery() {
    return this.router.navigate([`/${passwordRecoveryRoute}`], {relativeTo: this.route})
  }

  routeToRegister() {
    return this.router.navigate([`/${registerRoute}`], {relativeTo: this.route})
  }

  routeToCommunity(communityId: number) {
    return this.router.navigate([`/${communityRoute}/${communityId}`], {relativeTo: this.route})
  }

  routeToVerifyEmail() {
    return this.router.navigate([`/${verifyEmailRoute}`], {relativeTo: this.route})
  }

  routeToConnectionSecurity() {
    return this.router.navigate([`/${userAccountRoute}/${connectionSecurityRoute}`], {relativeTo: this.route})
  }

  routeToUserSettings() {
    return this.router.navigate([`/${userAccountRoute}/${userSettingsRoute}`], {relativeTo: this.route})
  }

  routeToCampaign(communityId: number, campaignId: number) {
    return this.router.navigate([`/${communityRoute}/${communityId}/${campaignRoute}/${campaignId}`], {relativeTo: this.route})
  }
}
