import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from 'src/app/store/selectors/user.selectors';
import { LoggedInUser } from 'src/app/store/actions/user.actions';
import { tap, throwError, catchError, Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { selectEmployeeHouse } from 'src/app/store/selectors/hr-housing.selectors';
import { HousingService } from 'src/app/services/housing.service';


@Component({
  selector: 'app-employee-housing-page',
  templateUrl: './employee-housing-page.component.html',
  styleUrls: ['./employee-housing-page.component.sass'],
})
export class EmployeeHousingPageComponent {
  display: string = 'view';
  title: string = '';
  desc: string = '';
  user!: LoggedInUser | null;
  housing$!: Observable<any>;
  get_url: string = '/api/info/getInfo';

  constructor(private store: Store, private http: HttpClient, private housingService: HousingService) {}

  ngOnInit() {
    
    this.store.select(selectUser).subscribe((user) => {
      this.user = user;
    });
    this.housingService.updateEmployeeHouse()
    this.housing$ = this.store.select(selectEmployeeHouse);
  }

  setDisplay(newDisplay: string) {
    this.display = newDisplay;
  }

  isActive(selectedDisplay: string) {
    return this.display === selectedDisplay;
  }

  onSubmit() {
    const report = {
      title: this.title,
      desc: this.desc,
    };
    this.http.post<{message: string}>('api/housing/create_fac_report', report)
    .pipe(
      tap(response => {
        console.log(response)
        this.housingService.updateEmployeeHouse()
        this.title = '';
        this.desc = '';
      }),
      catchError(error => {
        console.error('Error occured:', error);
        return throwError(() => error)
      })
    )
    .subscribe();
  }
}
