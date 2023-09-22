import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepageheaderComponent } from './employeepageheader.component';

describe('EmployeepageheaderComponent', () => {
  let component: EmployeepageheaderComponent;
  let fixture: ComponentFixture<EmployeepageheaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeepageheaderComponent]
    });
    fixture = TestBed.createComponent(EmployeepageheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
