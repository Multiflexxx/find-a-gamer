import { Directive } from '@angular/core';
import { AbstractControl, ValidatorFn, NG_VALIDATORS } from '@angular/forms';
import * as EmailValidator from 'email-validator';

@Directive({
  selector: '[appEmailValidator]',
  providers: [{ provide: NG_VALIDATORS, useValue: EmailValidatorDirective, multi: true }]
})
export class EmailValidatorDirective {

  constructor() { }

}

export function emailValidator(): ValidatorFn {
  // return (control: AbstractControl): {[key: string]: any} | null => {
  return function (control: AbstractControl): { [key: string]: any } | null {
    let forbidden;
    if (!EmailValidator.validate(control.value) && control.value !== "") {
      forbidden = true;
    } else {
      forbidden = false;
    }
    return forbidden ? { 'forbiddenEmail': { value: control.value } } : null;
  };
}