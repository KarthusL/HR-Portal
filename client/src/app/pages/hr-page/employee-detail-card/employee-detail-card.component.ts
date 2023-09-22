import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee_Info } from '../../../models/employee.interface';
import { hrToken } from '../hrAuthToken';

interface Response {
  message: string;
  data: Employee_Info;
}

@Component({
  selector: 'app-employee-detail-card',
  templateUrl: './employee-detail-card.component.html',
  styleUrls: ['./employee-detail-card.component.sass']
})
export class EmployeeDetailCardComponent {
  @Input() email!: string;
  private token = hrToken;
  res: any = {};
  employee: any = {};
  defaultImage: string = 'assets/default_user_image.jpg';

  // res: Response = {
  //   message: "",
  //   data: <Employee_Info>{},
  // };
  // employee= this.res.data

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Set up the headers with the token
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
    };

    // Body of the request
    const targetUserEmail = this.email
    const token = this.token

    // Make the request
    this.http.get(`http://localhost:3000/api/info/getInfo?targetUserEmail=${targetUserEmail}`, httpOptions).subscribe(response => {
      this.res = response
      if (this.res&& this.res.hasOwnProperty('data')) {
        this.employee = this.res.data
      } else {
        console.error('Response does not have a "data" property');
      };
    }, error => {
      console.error(error);
    });
  }

}
