import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';


@NgModule({
  declarations: [ProfileOverviewComponent, ProfileUpdateComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
