import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedComponentsModule } from '../shared-components.module';

import { MatchRoutingModule } from './match-routing.module';
import { MatchSearchComponent } from './match-search/match-search.component';


@NgModule({
  declarations: [
    MatchSearchComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatchRoutingModule,
    SharedComponentsModule
  ]
})
export class MatchModule { }
