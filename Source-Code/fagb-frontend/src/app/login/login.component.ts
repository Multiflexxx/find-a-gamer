import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Login } from '../data_objects/login'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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
    var login = new Login(null, this.loginValue.email.value, this.loginValue.password.value, this.loginValue.check.value)
    console.log(this.loginValue.email.value);
    console.log(login);
  }
}