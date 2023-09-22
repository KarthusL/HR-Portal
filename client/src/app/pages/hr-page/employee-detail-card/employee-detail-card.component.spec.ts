import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailCardComponent } from './employee-detail-card.component';

describe('EmployeeDetailCardComponent', () => {
  let component: EmployeeDetailCardComponent;
  let fixture: ComponentFixture<EmployeeDetailCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDetailCardComponent]
    });
    fixture = TestBed.createComponent(EmployeeDetailCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
