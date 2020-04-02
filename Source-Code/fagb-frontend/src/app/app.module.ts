import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';

import {AppRoutingModule} from './app-routing.module';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BackgroundComponent } from './background/background.component';
import { EmailValidatorDirective } from './shared/email-validator.directive';
import { CompareValidatorDirective } from './shared/compare-validator.directive';
import { LandingPageNavbarComponent } from './landing-page-navbar/landing-page-navbar.component';
import { GameValidatorDirective } from './shared/game-validator.directive';
import { ProfileModule } from './profile/profile.module';
import { MatchModule } from './match/match.module';
import { SharedComponentsModule } from './shared-components.module';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    LandingPageComponent,
    EmailValidatorDirective,
    CompareValidatorDirective,
    BackgroundComponent,
    LandingPageNavbarComponent,
    GameValidatorDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    ProfileModule,
    MatchModule,
    AppRoutingModule,
    SharedComponentsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
