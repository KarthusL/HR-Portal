import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrMainPageComponent } from './hr-main-page.component';

describe('HrMainPageComponent', () => {
  let component: HrMainPageComponent;
  let fixture: ComponentFixture<HrMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrMainPageComponent]
    });
    fixture = TestBed.createComponent(HrMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
