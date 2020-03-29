import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';

// Angular Material Components
// import {MatCheckboxModule} from '@angular/material/checkbox';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddGameComponent } from './add-game/add-game.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HttpClientModule } from '@angular/common/http';
import { EmailValidatorDirective } from './shared/email-validator.directive';
import { CompareValidatorDirective } from './shared/compare-validator.directive';
import { BackgroundComponent } from './background/background.component';
import { LandingPageNavbarComponent } from './landing-page-navbar/landing-page-navbar.component';

import { GamesearchComponent } from './gamesearch/gamesearch.component';
import { NavbarGamesearchComponent } from './navbar-gamesearch/navbar-gamesearch.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    AddGameComponent,
    LandingPageComponent,
    EmailValidatorDirective,
    CompareValidatorDirective,
    BackgroundComponent,
    LandingPageNavbarComponent,

    GamesearchComponent,

    NavbarGamesearchComponent,

    SearchComponent,

    ProfileComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
