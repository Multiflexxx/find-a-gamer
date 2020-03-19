import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  toggle(): void{
    if(document.getElementById("login-modal").className == "modal"){
    document.getElementById("login-modal").className = "modal is-active";
    }else{
      document.getElementById("login-modal").className = "modal";
    }
  }
}
