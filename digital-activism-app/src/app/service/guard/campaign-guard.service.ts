import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {StorageKeys} from '../../component/misc/storage-keys';
import {CampaignService} from '../campaign.service';
import {AuthenticatedGuardService} from './authenticated-guard.service';
import {CommunityGuardService} from './community-guard.service';
import {InternalContainerService} from '../misc/internal-container.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignGuardService implements CanActivate {


  constructor(private authenticatedGuardService: AuthenticatedGuardService,
              private campaignService: CampaignService,
              private internalContainerService: InternalContainerService,
              private communityGuardService: CommunityGuardService) {
  }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const campaignDto = await this.campaignService.getCampaignByIdAndCommunityId(route.params[StorageKeys.CAMPAIGN_ID], route.params[StorageKeys.COMMUNITY_ID]);

    if (campaignDto != undefined) {
      this.internalContainerService.setCampaignDTO(campaignDto);

      return await this.communityGuardService.canActivate(route, state) &&
        await this.authenticatedGuardService.canActivate(route, state);

    } else {
      return Promise.resolve(false);
    }
  }
}
