import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';


@NgModule({
  declarations: [ProfileOverviewComponent, ProfileUpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    MaterialModule
  ]
})
export class ProfileModule { }
