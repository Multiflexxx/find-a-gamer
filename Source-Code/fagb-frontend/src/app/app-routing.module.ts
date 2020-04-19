import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

// Import components
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthenticationGuard } from './_guards/authentication.guard';
import { HistoryComponent } from './history/history.component';

const appRoutes: Routes = [
  // {
  //   path: 'profile',
  //   canActivate: [AuthenticationGuard],
  //   component: ProfileComponent,
  // },
  {
    path: 'login',
    canActivate: [AuthenticationGuard],
    component: LoginComponent
  },
  {
    path: 'register',
    canActivate: [AuthenticationGuard],
    component: RegisterComponent
  },
  {
    path: 'history',
    canActivate: [AuthenticationGuard],
    component: HistoryComponent
  },
  {
    path: '',
    canActivate: [AuthenticationGuard],
    component: LandingPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
