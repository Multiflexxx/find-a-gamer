import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public emailValid: boolean;
  public pwEntered: boolean;
  private stayLoggedIn: boolean;
  public emailIsInitial: boolean;
  public pwIsInitial: boolean;
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  loginForm: FormGroup;

  constructor( private formBuilder: FormBuilder
    ) {
      this.loginForm = this.formBuilder.group({
        email: '',
        password: '',
        stayLoggedIn:'',
      });
    }

  ngOnInit(): void {
    this.emailValid = true;
    this.pwEntered= true;
    this.emailIsInitial = true;
    this.pwIsInitial = true;
  }

  toggle(): void {
    if (document.getElementById("login-modal").className == "modal") {
      document.getElementById("login-modal").className = "modal is-active";
    } else {
      document.getElementById("login-modal").className = "modal";
    }
  }

  validateEmail(event: any){
    this.emailIsInitial = false;
    if(this.regexp.test(event.target.value)){
      this.emailValid = true;
    }else{
      this.emailValid = false;
    }
  }

  validatePassword(event: any){
    this.pwIsInitial = false;
    if(event.target.value == "" || event.target.value == null){
      this.pwEntered = false;
    }else{
      this.pwEntered = true;
    }
  }

  login(userData): void {
    console.log(userData);
  }

}
