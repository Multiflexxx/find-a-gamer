import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';

import { AddGameComponent } from './add-game/add-game.component';



@NgModule({
  declarations: [
    AddGameComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ], 
  exports: [
    AddGameComponent
  ]
})
export class SharedComponentsModule { }
