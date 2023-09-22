import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
// import { hrToken } from '../../../hrAuthToken';

@Component({
  selector: 'app-onboarding-view-application-form',
  templateUrl: './onboarding-view-application-form.component.html',
  styleUrls: ['./onboarding-view-application-form.component.sass']
})
// export class OnboardingViewApplicationFormComponent {

// }
export class OnboardingViewApplicationFormComponent {
  @Input() email!: string;
  @Input() status!: string;
  data: any = {};
  // private token = hrToken;

  isDisabled: boolean = false;
  feedbackVisible: boolean = false;
  feedbackWarning: string = '';
  message: string = '';
  feedback: string = '';

  constructor(private http: HttpClient) {}

  onAccept() {
    this.isDisabled = true;
    this.message = 'You have approved the application';
    this.feedbackWarning = ''

    // Trigger the PUT request to your backend API
    // Set up the headers with the token
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer '+this.token
    //   })
    // };

    // Body of the request
    // const token = this.token
    const resBody = {
      status: 'Approved',
      email: this.email
    }

    this.http.put('http://localhost:3000/api/hr/hire', resBody).subscribe( response => {
    //this.http.put('http://localhost:3000/api/hr/hire', resBody, httpOptions).subscribe( response => {
      console.log(response)
    }, error => {
      console.error(error);
    });
  }

  onReject() {
    this.isDisabled = true;
    this.feedbackVisible = true;
  }

  onSubmitFeedback(input:string) {
    this.feedback = input.trim()
    if(this.feedback === '') {
      this.feedbackWarning = 'Feedback is required.';
      return;
    }
    
    this.feedbackVisible = false;
    this.message = 'You have rejected the application';
    this.feedbackWarning = ''

    // Trigger the PUT request to your backend API
    // Set up the headers with the token
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer '+this.token
    //   })
    // };

    // Body of the request
    // const token = this.token
    const resBody = {
      status: 'Rejected',
      email: this.email,
      msg: this.feedback
    }

    // this.http.put('http://localhost:3000/api/hr/hire', resBody, httpOptions).subscribe( response => {
    this.http.put('http://localhost:3000/api/hr/hire', resBody).subscribe( response => {
      console.log(response)
    }, error => {
      console.error(error);
    });
  }


}