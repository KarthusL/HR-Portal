import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HousingService } from 'src/app/services/housing.service';
@Component({
  selector: 'app-add-housing-form',
  templateUrl: './add-housing-form.component.html',
  styleUrls: ['./add-housing-form.component.sass']
})
export class AddHousingFormComponent {
  states: string[] = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  housingForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private housingService: HousingService
    ) {
    this.housingForm = this.formBuilder.group({
      address: this.formBuilder.group({
        street: ['', Validators.required],
        zip: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern(/^\d+$/)])],
        city: ['', Validators.required],
        state: ['', Validators.required]
      }),
      landlord: this.formBuilder.group({
        fname: ['', Validators.required],
        lname: ['', Validators.required],
        email: ['', Validators.compose([Validators.required, Validators.email])],
        phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^\d+$/)])]
      }),
      furniture: this.formBuilder.group({
        beds: ['', Validators.compose([Validators.required, Validators.min(0)])],
        mattresses: ['', Validators.compose([Validators.required, Validators.min(0)])],
        chairs: ['', Validators.compose([Validators.required, Validators.min(0)])],
        tables: ['', Validators.compose([Validators.required, Validators.min(0)])]
      })
    });
  }

  onSubmit() {
    if (this.housingForm.valid) {
      const formValue = this.housingForm.value;
      this.postData(formValue);
      this.housingForm.reset();
    }
  }

  postData(body: any) {
    this.http.post<{message: string}>('api/hr/house',body)
    .pipe(
      tap(response => {
        console.log('POST request successful:', response);
        if (response.message === 'created!') {
          this.housingService.updateHousesState();
        }
      }),
      catchError(error => {
        console.error('Error occurred:', error);
        // Handle any errors here
        return throwError(() => error);
      })
    )
    .subscribe();
  }
}
