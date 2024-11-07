import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {StorageKeys} from '../../component/misc/storage-keys';
import {RouterService} from '../router.service';
import {AuthenticationService} from '../authentication.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetGuardService implements CanActivate {
  protected authenticationService: AuthenticationService = inject(AuthenticationService);

  constructor() {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const token= route.params[StorageKeys.USER_TOKEN];

    if (token != null && token.length > 0) {
      return this.authenticationService.verifyToken(token);
    } else {
      return new Observable(subscriber => {
        subscriber.next(false);
      })
    }
  }
}
