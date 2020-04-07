import { Component, OnInit, Input } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() login: LoginComponent;

  constructor(private authenticationService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onLogout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}
