import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-log-in-page',
  templateUrl: './log-in-page.component.html',
  styleUrls: ['./log-in-page.component.sass']
})

export class LogInPageComponent {
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {}

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  async onSubmit() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    try {

      const res: any = await firstValueFrom(this.http.post('api/auth/signin', { uname:username, psw:password }, { observe: 'response' }));
      const { token, role } = res.body;

      localStorage.setItem('ACCESS_TOKEN', token);

      if (role === 'normal') {
        this.router.navigate(['employee']);
      } else if (role === 'hr') {
        this.router.navigate(['hr']);
      }

    } catch (error) {
      this.errorMessage = 'username or password is incorrect';
      console.error(error);
    }
  }
}
