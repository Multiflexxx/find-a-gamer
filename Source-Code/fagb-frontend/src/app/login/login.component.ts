import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthenticationService } from '../_services/authentication.service';

import { ToastrService } from 'ngx-toastr';
import { ControlsMap } from '../_interface/controls-map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hide: boolean = true;
  public loading: boolean = false;


  public constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastrService: ToastrService,
  ) { }

  public ngOnInit(): void {
    this.createForm();
  }

  public hidePw(event: any): void { // without type info @https://angular.io/guide/user-input
    this.hide = !this.hide;
    event.preventDefault();
  }

  public createForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      check: [false]
    });
  }

  private get loginValue(): ControlsMap<AbstractControl> {
    return this.loginForm.controls;
  }

  public onLoginSubmit(): void {
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
