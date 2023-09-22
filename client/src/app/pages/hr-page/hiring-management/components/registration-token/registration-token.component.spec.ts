import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationTokenComponent } from './registration-token.component';

describe('RegistrationTokenComponent', () => {
  let component: RegistrationTokenComponent;
  let fixture: ComponentFixture<RegistrationTokenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationTokenComponent]
    });
    fixture = TestBed.createComponent(RegistrationTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
