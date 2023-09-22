import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { hrToken } from './hrAuthToken';

@Component({
  selector: 'app-hr-page',
  templateUrl: './hr-page.component.html',
  styleUrls: ['./hr-page.component.sass']
})
export class HrPageComponent {
  token = hrToken
  title: string = 'ng2-pdf-viewer';
  // src: string = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  // src: string = 'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf';

  //pdfSrc = "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf";
  //pdfSrc = "C:/Users/carak/Desktop/beaconfire assignment/Week5Day5 - HRProject/HR Project(for MERAN).pdf";
   pdfSrc = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
   // pdfSrc = "https://drive.google.com/viewerng/viewer?embedded=true&url=http://infolab.stanford.edu/pub/papers/google.pdf#toolbar=0&scrollbar=0"


  constructor(private http: HttpClient) { }

  getPdf() {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    const fileName = "receipt"
    const targetUserEmail = "Josefine73@hotmail.com"
    const url = `http://localhost:3000/api/info/download?fileName=${fileName}&targetUserEmail=${targetUserEmail}`

    // Make the request
    this.http.get(url, httpOptions).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  downloadFile(filename: string) {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    const fileName = "receipt"
    const targetUserEmail = "Josefine73@hotmail.com"
    const url = `http://localhost:3000/api/info/download?fileName=${fileName}&targetUserEmail=${targetUserEmail}`
   
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

  previewFile(filename: string) {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    const fileName = "receipt"
    const targetUserEmail = "Josefine73@hotmail.com"
    const url = `http://localhost:3000/api/info/download?fileName=${fileName}&targetUserEmail=${targetUserEmail}`

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




  // get by user email
  getInfo() {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    const targetUserEmail = "Jeremy.Lokar98@yahoo.com"

    // Make the request
    this.http.get(`/api/info/getInfo?targetUserEmail=${targetUserEmail}`, httpOptions).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  getAllEmployeeProfile() {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Parameters of the request
    const token = this.token
    const identifier = "fname";
    const val = 'li';

    // Make the request
    this.http.get(`/api/hr/profile?token=${token}&identifier=${identifier}&val=${val}`, httpOptions).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  getAllEmailHistory() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };
    const token = this.token

    this.http.get(`/api/hr/hire_new?token=${token}`, httpOptions).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  getAllOboardingEmployee() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };
    const token = this.token
    const status_filter = ''

    this.http.get(`/api/hr/hire?token=${token}&status_filter=${status_filter}`, httpOptions).subscribe(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }
}
