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
    private autenticationService: AuthenticationService
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
    this.autenticationService.login(this.loginValue).subscribe(
      (data)=>{
        console.log(data);
        this.router.navigate(['/profile']);
      },
      (error)=>{
        console.log(error.error.error);
        this.loading = false;
      }
    )
  }
}