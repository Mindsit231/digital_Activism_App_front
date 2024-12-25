import {Routes} from '@angular/router';
import {HomeComponent} from './component/home/home.component';
import {LoginComponent} from './component/authentication/login/login.component';
import {RegisterComponent} from './component/authentication/register/register.component';
import {PasswordRecoveryComponent} from './component/authentication/password-recovery/password-recovery.component';
import {PasswordResetComponent} from './component/authentication/password-reset/password-reset.component';
import {StorageKeys} from './component/misc/storage-keys';
import {UserSettingsComponent} from './component/user-account/user-settings/user-settings.component';
import {ConnectionSecurityComponent} from './component/user-account/connection-security/connection-security.component';
import {UserAccountComponent} from './component/user-account/user-account.component';
import {VerifyEmailComponent} from './component/authentication/verify-email/verify-email.component';
import {AuthenticatedGuardService} from './service/guard/authenticated-guard.service';
import {VerifyMailGuardService} from './service/guard/verify-mail-guard.service';
import {PasswordResetGuardService} from './service/guard/password-reset-guard.service';
import {MyCommunitiesComponent} from './component/user-account/my-communities/my-communities.component';
import {ExploreCommunitiesComponent} from './component/explore-communities/explore-communities.component';
import {CommunityComponent} from './component/community/community.component';
import {CommunityGuardService} from './service/guard/community-guard.service';
import {CampaignComponent} from './component/campaign/campaign.component';
import {CampaignGuardService} from './service/guard/campaign-guard.service';
import {MyCampaignsComponent} from './component/user-account/my-campaigns/my-campaigns.component';

export const homeRoute = `home`;
export const loginRoute = `login`;
export const registerRoute = `register`;
export const verifyEmailRoute = `verify-email`;
export const passwordRecoveryRoute = `password-recovery`;
export const userAccountRoute = `user-account`;
export const connectionSecurityRoute = `connection-security`;
export const myCommunitiesRoute = `my-communities`;
export const myCampaignsRoute = `my-campaigns`;
export const userSettingsRoute = `user-settings`;
export const passwordResetRoute = `password-reset`;
export const exploreCommunitiesRoute = `explore-communities`;
export const communityRoute = `community`;
export const campaignRoute = `campaign`;

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: `${homeRoute}`, component: HomeComponent},
  {path: `${loginRoute}`, component: LoginComponent},
  {path: `${registerRoute}`, component: RegisterComponent},
  {path: `${verifyEmailRoute}`, component: VerifyEmailComponent, canActivate: [VerifyMailGuardService]},
  {path: `${passwordRecoveryRoute}`, component: PasswordRecoveryComponent},
  {
    path: `${passwordResetRoute}/:${StorageKeys.USER_TOKEN}`,
    component: PasswordResetComponent,
    canActivate: [PasswordResetGuardService]
  },
  {
    path: `${passwordResetRoute}`,
    component: PasswordResetComponent,
    canActivate: [PasswordResetGuardService]
  },
  {
    path: `${userAccountRoute}`, component: UserAccountComponent,
    children: [
      {path: `${connectionSecurityRoute}`, component: ConnectionSecurityComponent},
      {path: `${myCommunitiesRoute}`, component: MyCommunitiesComponent},
      {path: `${myCampaignsRoute}`, component: MyCampaignsComponent},
      {path: `${userSettingsRoute}`, component: UserSettingsComponent},
    ],
    canActivate: [AuthenticatedGuardService]
  },
  {
    path: `${exploreCommunitiesRoute}`,
    component: ExploreCommunitiesComponent,
    canActivate: [AuthenticatedGuardService]
  },
  {
    path: `${communityRoute}/:${StorageKeys.COMMUNITY_ID}`,
    component: CommunityComponent,
    canActivate: [CommunityGuardService]
  },
  {
    path: `${communityRoute}`,
    component: CommunityComponent,
    canActivate: [CommunityGuardService]
  },
  {
    path: `${communityRoute}/:${StorageKeys.COMMUNITY_ID}/${campaignRoute}/:${StorageKeys.CAMPAIGN_ID}`,
    component: CampaignComponent,
    canActivate: [CampaignGuardService]
  },
  {
    path: `${communityRoute}/${campaignRoute}`,
    component: CampaignComponent,
    canActivate: [CampaignGuardService]
  },
];
