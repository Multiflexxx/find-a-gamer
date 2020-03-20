import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // stepper
  isEditable = false;
  hide = true;
  profileFormGroup: FormGroup;
  gameFormGroup: FormGroup;

  url = 'http://httpbin.org/post';
  json;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.profileFormGroup = this.formBuilder.group({
      nameCtrl: ['', Validators.required],
      tagCtrl: ['', Validators.required],
      passCtrl: ['', Validators.required],
      rpassCtrl: ['', Validators.required],
      mailCtrl: ['', [Validators.required, Validators.email]]
    });
    
    this.gameFormGroup = this.formBuilder.group({
      gameCtrl: ['', Validators.required]
    });
  }

  onSubmit(userData) {
    this.http.post(this.url, userData).toPromise().then((data:any) => {
      console.log(data);
      this.json = JSON.stringify(data.json);
    });
    console.log('Form Test', userData);
  }

  onSubmit1(userData) {
    this.http.post(this.url, userData).toPromise().then((data:any) => {
      console.log(data);
      this.json = JSON.stringify(data.json);
    });
    console.log('Form Test', userData);
  }

  ngOnInit(): void {
  }

}
