import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';

import { AuthenticationGuard } from '../_helpers/authentication.guard';

const routes: Routes = [
  {
    path: 'profile',
    canActivate: [AuthenticationGuard],
    component: ProfileOverviewComponent
  },
  {
    path: 'profile-update',
    canActivate: [AuthenticationGuard],
    component: ProfileUpdateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
