import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationGuard } from '../_helpers/authentication.guard';

import { MatchSearchComponent } from './match-search/match-search.component'

const routes: Routes = [
  {
    path: 'match',
    // canActivate: [AuthenticationGuard],
    component: MatchSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatchRoutingModule { }
