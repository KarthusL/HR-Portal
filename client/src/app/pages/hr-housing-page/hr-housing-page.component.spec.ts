import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrHousingPageComponent } from './hr-housing-page.component';

describe('HrHousingPageComponent', () => {
  let component: HrHousingPageComponent;
  let fixture: ComponentFixture<HrHousingPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrHousingPageComponent]
    });
    fixture = TestBed.createComponent(HrHousingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});