import { Component, Input } from '@angular/core';
import { Housing } from 'src/app/models/housing.interface';
import { Store, select } from '@ngrx/store';
import { showHouseDetails } from 'src/app/store/actions/hr-housing.actions';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HousingService } from 'src/app/services/housing.service';
import { selectHouses } from 'src/app/store/selectors/hr-housing.selectors';

@Component({
  selector: 'app-housing-list',
  templateUrl: './housing-list.component.html',
  styleUrls: ['./housing-list.component.sass']
})
export class HousingListComponent {
  @Input() display!: string;
  houses$!: Observable<Housing[]>;

  constructor(
    private http: HttpClient,
    private store: Store,
    private housingService: HousingService
    ) {}

  ngOnInit(): void {
    this.houses$ = this.store.pipe(select(selectHouses));
  }

  onViewDetails(house: Housing): void {
    this.store.dispatch(showHouseDetails({ houseId: house._id }));
  };

  onDeleteHouse(id: string) {
    this.http.delete<{message: string}>(`api/hr/house?house_id=${id}`)
    .pipe(
      tap(response => {
        console.log(response);
        if (response.message === 'Delete successful!') {
          this.housingService.updateHousesState();
        }
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
    .subscribe();
  }
}
