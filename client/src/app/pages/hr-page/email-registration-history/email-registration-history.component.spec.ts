import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRegistrationHistoryComponent } from './email-registration-history.component';

describe('EmailRegistrationHistoryComponent', () => {
  let component: EmailRegistrationHistoryComponent;
  let fixture: ComponentFixture<EmailRegistrationHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailRegistrationHistoryComponent]
    });
    fixture = TestBed.createComponent(EmailRegistrationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
