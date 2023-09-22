import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';

interface ApiResponse {
  data: {
    status: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EmployeeprotectService implements CanActivate {
  get_url: string = '/api/info/getInfo';

  constructor(private http: HttpClient, private router: Router) {}
  canActivate(): Observable<boolean> {
    return this.http.get<ApiResponse>(this.get_url).pipe(
      map((response) => {
        if (response.data.status !== 'Approved') {
          this.router.navigate(['/employee']);
          return false;
        }
        return true;
      })
    );
  }
}
