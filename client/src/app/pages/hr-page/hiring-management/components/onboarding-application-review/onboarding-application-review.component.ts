import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { hrToken } from '../../../hrAuthToken';

@Component({
  selector: 'app-onboarding-application-review',
  templateUrl: './onboarding-application-review.component.html',
  styleUrls: ['./onboarding-application-review.component.sass']
})

export class OnboardingApplicationReviewComponent implements OnInit {
  private token = hrToken;

  allPeople: any[] = [];
  people: any[] = [];
  activeStatus: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+hrToken
        })
      };
      
      const status_filter = ''
  
      this.http.get(`http://localhost:3000/api/hr/hire?token=${this.token}&status_filter=${status_filter}`, httpOptions).subscribe(data => {
        if(Array.isArray(data)) {
          this.allPeople = data;
          this.filterPeople('Pending');
        }
      }, error => {
        console.error(error);
      });
  }

  filterPeople(status: string): void {
    // Get all data again
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer '+hrToken
    //   })
    // };
    
    // const status_filter = ''

    // this.http.get(`http://localhost:3000/api/hr/hire?token=${this.token}&status_filter=${status_filter}`, httpOptions).subscribe(data => {
    //   if(Array.isArray(data)) {
    //     this.allPeople = data;
    //   }
    // }, error => {
    //   console.error(error);
    // });
    
    // Original logic
    this.activeStatus = status;
    this.people = this.allPeople.filter(person => person.status === status);
  }

  toggleForm(email: string): void {
    this.people = this.people.map(person => {
      if (person.email === email) {
        return { ...person, showForm: !person.showForm };
      }
      return person;
    });
  }
}

