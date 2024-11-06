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
    memberDto: MemberDTO
  }>) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let internalObject = this.internalObjectService.getObject();
    return internalObject.verificationCodeHash != null && internalObject.memberDto != null && internalObject.memberDto.token != null;
  }
}
