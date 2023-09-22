import { Component, OnInit } from '@angular/core';
import { EmailRegistrationHistoryService } from './email-registration-history.service';

@Component({
  selector: 'app-email-registration-history',
  templateUrl: './email-registration-history.component.html',
  styleUrls: ['./email-registration-history.component.sass']
})
export class EmailRegistrationHistoryComponent {
  // emailHistory : {
  //   email: string;
  //   fname: string;
  //   lname: string;
  //   link: string;
  //   isRegister: boolean;
  //   createTime: string;
  //   }[] = [];
  emailHistory : {
    email: string;
    name: string;
    lname: string;
    status: string;
  }[] = [];

  constructor(private appService: EmailRegistrationHistoryService) { }

  ngOnInit() {
    this.appService.getRegistrationEmailHistory().subscribe(data => {
      if(Array.isArray(data)) {
        this.emailHistory = data
        // this.emailHistory = data.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
      }
    });
  }
}
