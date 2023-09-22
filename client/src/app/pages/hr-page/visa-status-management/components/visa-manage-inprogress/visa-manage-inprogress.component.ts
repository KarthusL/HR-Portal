import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { hrToken } from '../../../hrAuthToken';
import { EmailService } from 'src/app/services/email-service.service';

@Component({
  selector: 'app-visa-manage-inprogress',
  templateUrl: './visa-manage-inprogress.component.html',
  styleUrls: ['./visa-manage-inprogress.component.sass']
})
export class VisaManageInprogressComponent implements OnInit {
  private token = hrToken;

  usersData: any[] = [];

  constructor(private http: HttpClient, private emailService: EmailService) { }

  ngOnInit() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+hrToken
      })
    };
    
    const identifier =''
    const val=''
    const progress="In Progress"
    const url=`http://localhost:3000/api/hr/visa?token=${this.token}&identifier=${identifier}&val=${val}&progress=${progress}`

    this.http.get(url, httpOptions).subscribe(data => {
      if(Array.isArray(data)) {
          this.usersData = data.map(user => ({...user, actionTaken: false, notificationSent: false}));
      }
      console.log(data)
    }, error => {
      console.error(error);
    });
}

  sendNotification(user: any) {
    this.emailService.sendNotification(user.fname+' '+user.lname, user.email, user.next_file)
      .then(response => {
        alert('Email sent successfully!');
      })
      .catch(error => {
        console.error('Error sending email:', error);
        // Handle error
    });
    user.notificationSent = true;
  }

  handleAction(user: any, action: string) {
    // console.log("action: ",action)
    if(action === 'Approve') {
      // console.log({uname: user.uname})
      user.actionTaken = true;
      const reqBody = {
        "email": user.email,
        "visa_status": 'approved',
        "visa_status_msg": ""
      }
      this.http.put("http://localhost:3000/api/hr/visa", reqBody)
        .subscribe(() => {alert("Approved user "+user.fname+' '+user.mname+' '+user.lname)});
    } else if (action === 'Reject') {
      user.actionTaken = true;
      user.showFeedback = true;
    }
  }

  sendFeedback(user: any) {
    // console.log( {uname: user.uname, visa_status_msg: user.feedback})
    user.feedbackSent = true;
    const reqBody = {
      "email": user.email,
      "visa_status": 'rejected',
      "visa_status_msg": user.feedback
    }
    this.http.put("http://localhost:3000/api/hr/visa", reqBody)
      .subscribe(() => {alert("Rejected user "+user.fname+' '+user.mname+' '+user.lname)});
  }

  downloadFile(filename: string, targetUserEmail:string) {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    // const fileName = "receipt"
    // const targetUserEmail = "Josefine73@hotmail.com"
    const url = `http://localhost:3000/api/info/download?fileName=${filename}&targetUserEmail=${targetUserEmail}`
   
    this.http
      .get(url, {
        responseType: 'json',
        headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token},
      })
      .subscribe({
        next: (response: any) => {
          if (response.mimeType.startsWith('image/')) {
            // For images, create a link element and simulate a click
            const link = document.createElement('a');
            link.href = response.file;
            link.download = response.filename;
            link.click();
          }
        },
        error: (err) => {
          if (err.name === 'HttpErrorResponse') {
            this.http
              .get(url, {
                responseType: 'blob',
                headers: { 'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.token},
              })
              .subscribe((blob: Blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename; // or use response.filename if available
                link.click();
              });
          }
        },
      });
  }

  previewFile(filename: string, targetUserEmail:string) {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    // const fileName = "receipt"
    // const targetUserEmail = "Josefine73@hotmail.com"
    const url = `http://localhost:3000/api/info/download?fileName=${filename}&targetUserEmail=${targetUserEmail}`

    this.http
      .get(url, {
        responseType: 'json',
        headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token},
      })
      .subscribe({
        next: (response: any) => {
          console.log(response);

          if (response.mimeType.startsWith('image/')) {
            // For images, we just use the base64 string directly
            const img = document.createElement('img');

            // Set its src to the base64 string
            img.src = response.file;

            // Optionally set some style attributes
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.height = 'auto';

            // Create a new window or tab
            const win = window.open('', '_blank');

            // Make sure the window was successfully opened
            if (win) {
              // Write the img element to the new window
              win.document.write(img.outerHTML);

              // You can also set the title of the new window
              win.document.title = response.filename;
            }
          }
        },
        error: (err) => {
          if (err.name === 'HttpErrorResponse') {
            this.http
              .get(url, {
                responseType: 'blob',
                headers: { 'Content-Type': 'application/json',
                'Authorization': 'Bearer '+this.token},
              })
              .subscribe((blob: Blob) => {
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
              });
          }
        },
      });
  }
}