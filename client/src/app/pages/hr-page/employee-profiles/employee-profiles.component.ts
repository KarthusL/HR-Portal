import { Component, OnInit } from '@angular/core';
import { Employee } from '../services/employee';
import { EmployeeService } from '../services/employee.service';
import { Observable, of } from 'rxjs';
import { Subject } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.sass']
})

export class EmployeeProfilesComponent implements OnInit {
  employees?: Employee[];

  private searchTerms = new Subject<string>();
  private searchField: string = "fname";

  constructor(private employeeService: EmployeeService) { }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.getEmployees();

    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.employeeService.searchEmployees(term, this.searchField)),
    ).subscribe(employees => this.employees = employees);
  }
  
  getEmployees(): void {
    this.employeeService.getEmployees()
      .subscribe(employees => this.employees = employees);
  }

  updateSearchField(field: string): void {
    this.searchField = field;
    //console.log(`Search field updated: ${this.searchField}`);
  }
}

