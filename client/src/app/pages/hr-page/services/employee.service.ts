import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Employee } from './employee';
import { hrToken } from '../hrAuthToken';

@Injectable({
    providedIn: 'root',
})
export class EmployeeService {
  private token = hrToken;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Parameters of the request
    const token = this.token;
    const identifier = "";
    const val = '';

    // Make the request
    return this.http.get<Employee[]>(`http://localhost:3000/api/hr/profile?token=${token}&identifier=${identifier}&val=${val}`, httpOptions);

  }

  searchEmployees(term: string, searchField:string): Observable<Employee[]> {
    if (!term.trim()) {
        // if not search term, return all employees.
        return this.getEmployees();
    }
    
    // return this.http.get<Employee[]>(`${this.api}/?fname=${term}`);
    // return of(EMPLOYEES_SEARCH)

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Parameters of the request
    const token = this.token;
    const identifier = searchField;
    const val = term.trim();

    // Make the request
    return this.http.get<Employee[]>(`http://localhost:3000/api/hr/profile?token=${token}&identifier=${identifier}&val=${val}`, httpOptions);
  }
}