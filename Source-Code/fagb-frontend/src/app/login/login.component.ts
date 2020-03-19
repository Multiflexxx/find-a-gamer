import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public emailValid: boolean;
  public pwEntered: boolean;
  private stayLoggedIn: boolean;
  public formIsInitial: boolean;
  regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  constructor() { }

  ngOnInit(): void {
    this.emailValid = true;
    this.pwEntered= true;
    this.formIsInitial = true;
  }

  toggle(): void {
    if (document.getElementById("login-modal").className == "modal") {
      document.getElementById("login-modal").className = "modal is-active";
    } else {
      document.getElementById("login-modal").className = "modal";
    }
  }

  validateEmail(event: any){
    this.formIsInitial = false;
    if(this.regexp.test(event.target.value)){
      this.emailValid = true;
    }else{
      this.emailValid = false;
      console.log("emailfalsch")
    }
  }

  validatePassword(event: any){
    this.formIsInitial = false;
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
