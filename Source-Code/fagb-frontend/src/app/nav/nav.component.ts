import { Component, OnInit, Input } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  @Input() login: LoginComponent;

  constructor() {
  }

  ngOnInit(): void {
  }

  loginButton(): void {
    this.login.toggle();
  }

}
