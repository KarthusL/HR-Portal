import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaManageAllComponent } from './visa-manage-all.component';

describe('VisaManageAllComponent', () => {
  let component: VisaManageAllComponent;
  let fixture: ComponentFixture<VisaManageAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisaManageAllComponent]
    });
    fixture = TestBed.createComponent(VisaManageAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
