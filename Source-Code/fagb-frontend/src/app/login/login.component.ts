import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      check: [false]
    });
  }

  private get loginValue() {
    return this.loginForm.controls;
  }

  onLoginSubmit() {
    this.loading = true;
    // let sessionId: string = '65ad0854-9858-4155-9ffd-80fd9ef6f2d8';
    this.authenticationService.login(this.loginValue).subscribe(
    // this.authenticationService.loginS(sessionId).subscribe(
      (data) => {
        console.log("Hier in login by session comp");
        console.log(data);
        this.router.navigate(['/profile']);
        this.loading = false;
      },
      (error) => {
        console.log(error.error.error);
        this.loading = false;
      }
    )
  }
}