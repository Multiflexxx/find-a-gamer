import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { AddGameComponent } from './add-game/add-game.component';
import { MatchmakingComponent } from './matchmaking/matchmaking.component';



@NgModule({
  declarations: [
    AddGameComponent,
    MatchmakingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    AddGameComponent,
    MatchmakingComponent
  ]
})
export class SharedComponentsModule { }
