import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeVisamgmPageComponent } from './employee-visamgm-page.component';

describe('EmployeeVisamgmPageComponent', () => {
  let component: EmployeeVisamgmPageComponent;
  let fixture: ComponentFixture<EmployeeVisamgmPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeVisamgmPageComponent]
    });
    fixture = TestBed.createComponent(EmployeeVisamgmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
