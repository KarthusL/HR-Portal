import { Component } from '@angular/core';

@Component({
  selector: 'app-visa-status-management',
  templateUrl: './visa-status-management.component.html',
  styleUrls: ['./visa-status-management.component.sass']
})
export class VisaStatusManagementComponent {
  selected: 'inprogress' | 'all' = 'inprogress';
}
