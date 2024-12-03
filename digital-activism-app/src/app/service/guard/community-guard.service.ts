import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthenticatedGuardService} from './authenticated-guard.service';
import {StorageKeys} from '../../component/misc/storage-keys';
import {CommunityService} from '../community.service';
import {TokenService} from '../token.service';
import {CommunityDTO} from '../../model/community-dto';
import {InternalObjectService} from '../misc/internal-object.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityGuardService implements CanActivate {

  constructor(private authenticatedGuardService: AuthenticatedGuardService,
              private communityService: CommunityService,
              private tokenService: TokenService,
              private internalObjectService: InternalObjectService<CommunityDTO>) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const communityDto = await this.communityService.getById(
      route.params[StorageKeys.COMMUNITY_ID],
      this.tokenService.getUserToken()
    );

    if (communityDto != undefined) {
      this.internalObjectService.setObject(communityDto);

      return await this.authenticatedGuardService.canActivate(route, state)
        && route.params[StorageKeys.COMMUNITY_ID] != null;

    } else {
      return Promise.resolve(false);
    }
  }

}
