import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

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
  loginForm;

  constructor( private formBuilder: FormBuilder
    ) {
      this.loginForm = this.formBuilder.group({
        email: '',
        password: '',
        stayLoggedIn:''});
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
      console.log("emailrichtig")
    }else{
      this.emailValid = false;
      console.log("emailfalsch")
    }
  }

  validatePassword(event: any){
    this.pwIsInitial = false;
    if(event.target.value == "" || event.target.value == null){
      this.pwEntered = false;
      console.log("pwfalsch")
    }else{
      this.pwEntered = true;
    }
  }

  login(): void {


  }

}
