import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {AuthenticatedGuardService} from './authenticated-guard.service';
import {StorageKeys} from '../../component/misc/storage-keys';
import {CommunityService} from '../community.service';
import {TokenService} from '../token.service';
import {CommunityDTO} from '../../model/community/community-dto';
import {InternalObjectService} from '../misc/internal-object.service';
import {InternalContainerService} from '../misc/internal-container.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityGuardService implements CanActivate {

  constructor(private authenticatedGuardService: AuthenticatedGuardService,
              private communityService: CommunityService,
              private internalContainerService: InternalContainerService) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const communityDto = await this.communityService.getCommunityById(route.params[StorageKeys.COMMUNITY_ID]);

    if (communityDto != undefined) {
      this.internalContainerService.setCommunityDTO(communityDto);

      return await this.authenticatedGuardService.canActivate(route, state);

    } else {
      return Promise.resolve(false);
    }
  }

}
