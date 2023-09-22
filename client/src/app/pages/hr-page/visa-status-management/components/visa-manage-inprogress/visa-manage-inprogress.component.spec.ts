import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaManageInprogressComponent } from './visa-manage-inprogress.component';

describe('VisaManageInprogressComponent', () => {
  let component: VisaManageInprogressComponent;
  let fixture: ComponentFixture<VisaManageInprogressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaManageInprogressComponent]
    });
    fixture = TestBed.createComponent(VisaManageInprogressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
