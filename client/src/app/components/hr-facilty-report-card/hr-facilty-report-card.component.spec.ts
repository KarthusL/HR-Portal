import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrFaciltyReportCardComponent } from './hr-facilty-report-card.component';

describe('HrFaciltyReportCardComponent', () => {
  let component: HrFaciltyReportCardComponent;
  let fixture: ComponentFixture<HrFaciltyReportCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrFaciltyReportCardComponent]
    });
    fixture = TestBed.createComponent(HrFaciltyReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
