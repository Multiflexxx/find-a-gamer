import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ControlContainer, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

import { ToastrService, ToastContainerDirective  } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide: boolean = true;
  loading: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  hidePw(event): void {
    this.hide = !this.hide;
    event.preventDefault();
  }

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      check: [false]
    });
  }

  private get loginValue() {
    return this.loginForm.controls;
  }

  onLoginSubmit(): void {
    this.loading = true;
    this.authenticationService.login(this.loginValue).subscribe(
      (data) => {
        console.log(data);
        this.router.navigate(['/profile']);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.log(error.error.error);
        this.toastrService.error(error.error.error, 'Login failed');
      }
    );
  }
}
