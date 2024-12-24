import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {StorageKeys} from '../../component/misc/storage-keys';
import {AuthenticatedGuardService} from './authenticated-guard.service';
import {CommunityService} from '../community.service';
import {InternalObjectService} from '../misc/internal-object.service';
import {CommunityDTO} from '../../model/community/community-dto';

@Injectable({
  providedIn: 'root'
})
export class CommunityAdminGuardService implements CanActivate {

  constructor(private authenticatedGuardService: AuthenticatedGuardService,
              private communityService: CommunityService,
              private internalObjectService: InternalObjectService<CommunityDTO>) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const communityDto = await this.communityService.getCommunityById(route.params[StorageKeys.COMMUNITY_ID]);

    if (communityDto != undefined) {
      this.internalObjectService.setObject(communityDto);
      return await this.authenticatedGuardService.canActivate(route, state) && communityDto.isAdmin;

    } else {
      return Promise.resolve(false);
    }
  }

}
