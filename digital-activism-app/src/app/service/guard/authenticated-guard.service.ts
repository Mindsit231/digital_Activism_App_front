import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {adminRole, authenticatedRole} from './role';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuardService implements CanActivate {
  constructor(private authenticationService: AuthenticationService) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return await this.authenticationService.canActivateRole([authenticatedRole, adminRole]);
  }
}
