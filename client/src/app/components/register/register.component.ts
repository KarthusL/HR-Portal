import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass'],
})
export class RegisterComponent {
  constructor() {}
  registrationForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  onSubmit() {
    console.log(this.registrationForm);
  }
  getEmailErrorMessage() {
    if (this.registrationForm.controls.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.registrationForm.controls.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }
  getUsernameErrorMessage() {
    // if (this.registrationForm.controls.email.hasError('required')) {
    return 'You must enter a valid username';
    // }

    // return this.registrationForm.controls.email.hasError('email')
    //   ? 'Not a valid email'
    //   : '';
  }
  getPasswordErrorMessage() {
    // if (this.registrationForm.controls.email.hasError('required')) {
    return 'You must enter a valid password';
    // }

    // return this.registrationForm.controls.email.hasError('email')
    //   ? 'Not a valid email'
    //   : '';
  }
}
