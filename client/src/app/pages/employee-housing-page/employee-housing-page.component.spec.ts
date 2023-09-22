import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHousingPageComponent } from './employee-housing-page.component';

describe('EmployeeHousingPageComponent', () => {
  let component: EmployeeHousingPageComponent;
  let fixture: ComponentFixture<EmployeeHousingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeHousingPageComponent]
    });
    fixture = TestBed.createComponent(EmployeeHousingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
