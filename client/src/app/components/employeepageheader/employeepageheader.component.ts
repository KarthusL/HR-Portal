import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employeepageheader',
  templateUrl: './employeepageheader.component.html',
  styleUrls: ['./employeepageheader.component.sass']
})
export class EmployeepageheaderComponent {
  constructor(private router: Router, private authService: AuthService){}
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
