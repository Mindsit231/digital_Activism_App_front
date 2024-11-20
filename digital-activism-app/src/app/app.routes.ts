import { Routes } from '@angular/router';
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
export const passwordResetRoute = `password-reset`;

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify-email', component: VerifyEmailComponent, canActivate: [VerifyMailGuardService]},
  {path: 'password-recovery', component: PasswordRecoveryComponent},
  {path: `${passwordResetRoute}/:${StorageKeys.USER_TOKEN}`,
    component: PasswordResetComponent, canActivate: [PasswordResetGuardService]
  },
  {
    path: 'user-account', component: UserAccountComponent,
    children: [
      {path: 'connection-security', component: ConnectionSecurityComponent},
      {path: 'my-groups', component: MyCommunitiesComponent},
      {path: 'user-settings', component: UserSettingsComponent},
    ],
    canActivate: [AuthenticatedGuardService]
  },
  {path: "explore-communities", component: ExploreCommunitiesComponent, canActivate: [AuthenticatedGuardService]}
];
