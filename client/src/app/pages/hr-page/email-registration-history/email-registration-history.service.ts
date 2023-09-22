import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { hrToken } from '../hrAuthToken';

@Injectable({
  providedIn: 'root'
})
export class EmailRegistrationHistoryService {
  private token = hrToken
  constructor(private http: HttpClient) { }

  getRegistrationEmailHistory(): Observable<any> {
    //return this.http.get<any>(this.apiUrl);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ this.token
      })
    };
   
    return this.http.get<any>(`http://localhost:3000/api/hr/hire_new?token=${this.token}`, httpOptions)
  }
}