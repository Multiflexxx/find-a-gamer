import { Component, OnInit, ViewChild } from '@angular/core';
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
  isLinear = true;
  hide = true;
  profileFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

// localhost:3060

  url = 'http://httpbin.org/post';
  json;

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) {
    this.profileFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      tagCtrl: ['', Validators.required],
      passCtrl: ['', Validators.required],
      rpassCtrl: ['', Validators.required],
      mailCtrl: ['', Validators.required]
    });
    
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  ngOnInit() {
    
  }

  onSubmit(userData) {
    // Process checkout data here
    // this.profileFormGroup.reset();

    this.http.post(this.url, userData).toPromise().then((data:any) => {
      console.log(data);
      this.json = JSON.stringify(data.json);
    });
    console.log('Form Test', userData);
  }

  getErrorMessage() {
    if (this.emailControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.emailControl.hasError('email') ? 'Not a valid email' : '';
  }

}
