import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSelectedHouse } from 'src/app/store/selectors/hr-housing.selectors';
import { LoggedInUser } from 'src/app/store/actions/user.actions';
import { selectUser } from 'src/app/store/selectors/user.selectors';

@Component({
  selector: 'app-housing-display',
  templateUrl: './housing-display.component.html',
  styleUrls: ['./housing-display.component.sass']
})
export class HousingDisplayComponent implements OnInit {
  selectedHouse$!: Observable<any>;
  user!: LoggedInUser | null;

  constructor(private store: Store) {};

  ngOnInit(): void {
    this.selectedHouse$ = this.store.select(selectSelectedHouse);
    this.store.select(selectUser).subscribe(user => {
      this.user = user;
    });
  }
}
