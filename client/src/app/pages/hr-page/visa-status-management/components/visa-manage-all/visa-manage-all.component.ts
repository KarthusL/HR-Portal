import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap, catchError
} from 'rxjs/operators';
import { hrToken } from '../../../hrAuthToken';
import {Observable} from 'rxjs';
import { of } from 'rxjs';

@Component({
  selector: 'app-visa-manage-all',
  templateUrl: './visa-manage-all.component.html',
  styleUrls: ['./visa-manage-all.component.sass']
})
export class VisaManageAllComponent implements OnInit {
  private token = hrToken;
  
  usersData: any[] = [];
  pdfUrl: string = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";

  private searchTerms = new Subject<string>();
  private searchField: string = "fname";

  constructor(private http: HttpClient) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    // this.http.get('http://localhost:3000/hr/visa-status/all')
    //   .subscribe((data) => {
    //     if(Array.isArray(data)) {
    //         this.usersData = data;
    //     }
    //   },error=>{
    //     // insert dummy data
    //     this.usersData = [
    //     { fname: 'Jessica', lname: 'Miller', visaType: 'Not applicable', visaStart: 'Not applicable', visaEnd: 'Not applicable', 
    //       visaRemain:"Not applicable", visa_status: 'waiting', next_file: 'receipt', uname:"jessica_miller", 
    //       pdf: [] },
    //     { fname: 'John', lname: 'Doe', visaType: 'OPT', visaStart: '2023-01-01', visaEnd: '2025-12-31', 
    //       visaRemain: 730, visa_status: 'pending', next_file: 'receipt', uname:"john_doe", 
    //       pdf: [{fileTitle: 'receipt', url:this.pdfUrl}]  },
    //     { fname: 'Jane', lname: 'Doe', visaType: 'OPT', visaStart: '2023-02-01', visaEnd: '2025-12-31', 
    //       visaRemain: 700, visa_status: 'waiting', next_file: 'EAD', uname:"jane_doe", 
    //       pdf: [{fileTitle: 'receipt', url:this.pdfUrl}] },
    //     { fname: 'Michael', lname: 'Smith', visaType: 'OPT', visaStart: '2023-03-01', visaEnd: '2025-12-31',
    //      visaRemain: 670, visa_status: 'pending', next_file: 'EAD', uname:"michael_smith", 
    //      pdf: [{fileTitle: 'receipt', url:this.pdfUrl}, {fileTitle: 'EAD', url:this.pdfUrl}] },
    //     { fname: 'Maria', lname: 'Gonzalez', visaType: 'OPT', visaStart: '2023-04-01', visaEnd: '2025-12-31',
    //      visaRemain: 640, visa_status: 'waiting', next_file: 'I-983', uname:"maria_gonzalez", 
    //      pdf: [{fileTitle: 'receipt', url:this.pdfUrl}, {fileTitle: 'EAD', url:this.pdfUrl}] },
    //     { fname: 'William', lname: 'Johnson', visaType: 'OPT', visaStart: '2023-05-01', visaEnd: '2025-12-31',
    //      visaRemain: 610, visa_status: 'pending', next_file: 'I-983', uname:"william_johnson", 
    //      pdf: [{fileTitle: 'receipt', url:this.pdfUrl}, {fileTitle: 'EAD', url:this.pdfUrl},
    //            {fileTitle: 'I-983', url:this.pdfUrl}] },
    //     { fname: 'Elizabeth', lname: 'Brown', visaType: 'OPT', visaStart: '2023-06-01', visaEnd: '2025-12-31',
    //      visaRemain: 580, visa_status: 'waiting', next_file: 'I-20', uname:"elizabeth_brown", 
    //      pdf: [{fileTitle: 'receipt', url:this.pdfUrl}, {fileTitle: 'EAD', url:this.pdfUrl},
    //            {fileTitle: 'I-983', url:this.pdfUrl}] },
    //     { fname: 'David', lname: 'Jones', visaType: 'OPT', visaStart: '2023-07-01', visaEnd: '2025-12-31',
    //      visaRemain: 550, visa_status: 'pending', next_file: 'I-20', uname:"david_jones", 
    //      pdf: [{fileTitle: 'receipt', url:this.pdfUrl}, {fileTitle: 'EAD', url:this.pdfUrl},
    //            {fileTitle: 'I-983', url:this.pdfUrl}, {fileTitle: 'I-20', url:this.pdfUrl}] },
    //      { fname: 'Fake', lname: 'Guy', visaType: 'OPT', visaStart: '2023-07-01', visaEnd: '2025-12-31',
    //      visaRemain: 550, visa_status: 'done', next_file: 'approved', uname:"fake_guy", 
    //      pdf: [{fileTitle: 'receipt', url:this.pdfUrl}, {fileTitle: 'EAD', url:this.pdfUrl},
    //            {fileTitle: 'I-983', url:this.pdfUrl}, {fileTitle: 'I-20', url:this.pdfUrl}] },
    //   ]
    // }); 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+hrToken
      })
    };
    
    const identifier =''
    const val=''
    const progress=""
    const url=`http://localhost:3000/api/hr/visa?token=${this.token}&identifier=${identifier}&val=${val}&progress=${progress}`

    this.http.get(url, httpOptions).subscribe(data => {
      if(Array.isArray(data)) {
          this.usersData = data.map(user => ({...user, actionTaken: false, notificationSent: false}));
      }
      console.log(data)
    }, error => {
      console.error(error);
    });

    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),


      // switch to new search observable each time the term changes
      switchMap((term: string) => 
         this.http.get(`http://localhost:3000/api/hr/visa?token=${this.token}&identifier=${this.searchField}&val=${term}&progress=${progress}`)
        //   .pipe(catchError((error) => {
        //   if (error.status === 404) {
        //     return [];
        //   } else {
        //     return [];
        //   }
        //  }))
      ),
    )
    .subscribe((datas: any) => this.usersData = datas, 
        error => { 
          this.usersData = []
          console.log(error)
        }
    );

  }

  updateSearchField(field: string): void {
    this.searchField = field;
    // sconsole.log(`Search field updated: ${this.searchField}`);
  }

}
