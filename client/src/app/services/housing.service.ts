import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Housing } from 'src/app/models/housing.interface';
import { updateHouses, updateEmployeeHouse } from '../store/actions/hr-housing.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class HousingService {

  constructor(private store: Store, private http: HttpClient) {}

  fetchHouses(): Observable<Housing[]> {
    return this.http.get<Housing[]>('api/hr/house');
  }

  fetchEmployeeHouse(): Observable<Housing> {
    return this.http.get<Housing>('api/housing/employee_house');
  }

  updateHousesState(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.fetchHouses().subscribe(
        (houses) => {
          this.store.dispatch(updateHouses({ houses }));
          resolve();
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateEmployeeHouse() {
      this.fetchEmployeeHouse().subscribe(
        (house) => {
          this.store.dispatch(updateEmployeeHouse({ house }));
        },
        (error) => {
          console.error(error);
        }
      );
  }

}

