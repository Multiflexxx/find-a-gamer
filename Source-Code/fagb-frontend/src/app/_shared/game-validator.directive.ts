import { Directive } from '@angular/core';
import { NG_VALIDATORS, ValidatorFn, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[appGameValidator]',
  providers: [{ provide: NG_VALIDATORS, useValue: GameValidatorDirective, multi: true }]
})
export class GameValidatorDirective {

  public constructor() { }

}

export function gameValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    let forbidden = true;
    if (control.value !== '[]') {
      forbidden = false;
    }
    return forbidden ? { forbiddenGame: { value: control.value } } : null;
  };
}
