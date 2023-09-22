import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingDisplayComponent } from './housing-display.component';

describe('HousingDisplayComponent', () => {
  let component: HousingDisplayComponent;
  let fixture: ComponentFixture<HousingDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HousingDisplayComponent]
    });
    fixture = TestBed.createComponent(HousingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
