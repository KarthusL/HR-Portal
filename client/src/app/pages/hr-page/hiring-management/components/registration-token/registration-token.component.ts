import { Component } from '@angular/core';
import { EmailService } from 'src/app/services/email-service.service';
// import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registration-token',
  templateUrl: './registration-token.component.html',
  styleUrls: ['./registration-token.component.sass']
})
export class RegistrationTokenComponent {
  user = {
    fname: '',
    lname: '',
    email: ''
  };

  // constructor(private http: HttpClient) {}
  constructor(private emailService: EmailService) { }

  // onSubmit(): void {
  //     // if(this.user) console.log(this.user)
  //     this.http.post('http://localhost:3000/api/register', this.user).subscribe();
  // }

  onSubmit() {
    const name = this.user.fname+' '+this.user.lname;
    const email = this.user.email;
    const message = '';

    this.emailService.sendEmail(name, email, message)
      .then(response => {
        alert('Email sent successfully!');
        this.user.fname = '';
        this.user.lname = '';
        this.user.email = '';
        // Handle success
      })
      .catch(error => {
        console.error('Error sending email:', error);
        // Handle error
    });
  }
}