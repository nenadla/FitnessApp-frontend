import { AbstractControl, ValidatorFn } from '@angular/forms';


export function matchValues(matchTo: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: matchTo };
  };
}

export function matchExactValue(expectedValue: string): ValidatorFn {
  return (control: AbstractControl) => {
    return control.value?.trim() === expectedValue?.trim() ? null : { notMatching: true };
  };
}

export function containNumbers(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.value;
    return /\d/.test(password) ? null : { missingNumber: true };
  };
}

export function uppercaseValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.value;
    return /[A-Z]/.test(password) ? null : { missingUppercase: true };
  };
}

export function specialCharacterValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const password = control.value;
    return /[^\p{L}\p{N}]/u.test(password) ? null : { missingSpecialCharacter: true };
  };
}

