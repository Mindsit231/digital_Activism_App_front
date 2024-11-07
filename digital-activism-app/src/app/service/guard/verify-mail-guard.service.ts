import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {InternalObjectService} from '../misc/internal-object.service';
import {MemberDTO} from '../../model/member/member-dto';

@Injectable({
  providedIn: 'root'
})
export class VerifyMailGuardService implements CanActivate {
  constructor(private internalObjectService: InternalObjectService<{
    verificationCodeHash: string,
    email: string
    token: string
  }>) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let internalObject = this.internalObjectService.getObject();
    if(internalObject.verificationCodeHash != null && internalObject.email != null && internalObject.token != null) {
      console.log("Passed VerifyMailGuardService");
      return true;
    } else {
      console.log("Failed VerifyMailGuardService");
      return false;
    }
  }
}
