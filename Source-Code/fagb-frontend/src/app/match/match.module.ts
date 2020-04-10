import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SharedComponentsModule } from '../shared-components.module';

import { MatchRoutingModule } from './match-routing.module';
import { MatchSearchComponent } from './match-search/match-search.component';
import { MatchProcessComponent } from './match-process/match-process.component';
import { MatchSuccessComponent } from './match-success/match-success.component';


@NgModule({
  declarations: [
    MatchSearchComponent,
    MatchProcessComponent,
    MatchSuccessComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedComponentsModule,
    MatchRoutingModule,
  ]
})
export class MatchModule { }
