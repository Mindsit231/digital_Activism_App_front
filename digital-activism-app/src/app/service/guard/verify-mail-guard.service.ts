import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {InternalObjectService} from '../misc/internal-object.service';

@Injectable({
  providedIn: 'root'
})
export class VerifyMailGuardService implements CanActivate {
  constructor(private internalObjectService: InternalObjectService<{
    email: string
    token: string
  }>) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let internalObject = this.internalObjectService.getObject();
    if (internalObject != null &&
      internalObject.email != null &&
      internalObject.token != null) {
      console.log("Passed VerifyMailGuardService");
      return true;
    } else {
      console.log("Failed VerifyMailGuardService");
      return false;
    }
  }
}
