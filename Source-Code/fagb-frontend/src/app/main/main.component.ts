import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isLinear = true;
  hide = true;
  profileFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  @ViewChild('profilestep') profilestep;

  emailControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  getErrorMessage() {
    if (this.emailControl.hasError('required')) {
      return 'You must enter a value';
    }

    return this.emailControl.hasError('email') ? 'Not a valid email' : '';
  }

  // matcher = new MyErrorStateMatcher();

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.profileFormGroup = this._formBuilder.group({
      nameCtrl: ['', Validators.required],
      tagCtrl: ['', Validators.required],
      passCtrl: ['', Validators.required],
      rpassCtrl: ['', Validators.required], 
      // emailControl: ['', Validators.email],  
    });
    
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

  }

}