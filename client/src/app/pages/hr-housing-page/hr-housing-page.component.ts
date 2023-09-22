import { Component } from '@angular/core';
import { HousingService } from 'src/app/services/housing.service';

@Component({
  selector: 'app-hr-housing-page',
  templateUrl: './hr-housing-page.component.html',
  styleUrls: ['./hr-housing-page.component.sass']
})
export class HrHousingPageComponent {
  display: string = 'view';

  constructor( private housingService: HousingService) {}

  ngOnInit() {
    this.housingService.updateHousesState();
  }

  isActive(category: string) {
    return this.display === category;
  };

  setDisplay(category: string) {
    this.display = category;
  }
}
