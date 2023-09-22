import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePersonalInfoComponent } from './employee-personal-info.component';

describe('EmployeePersonalInfoComponent', () => {
  let component: EmployeePersonalInfoComponent;
  let fixture: ComponentFixture<EmployeePersonalInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePersonalInfoComponent]
    });
    fixture = TestBed.createComponent(EmployeePersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
