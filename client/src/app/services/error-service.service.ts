import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private router: Router) { }

  redirectToErrorPage(errorCode: number) {
    this.router.navigate(['/error', errorCode]);
  }
}
