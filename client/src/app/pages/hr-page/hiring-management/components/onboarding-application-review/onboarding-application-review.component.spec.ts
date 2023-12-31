import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingApplicationReviewComponent } from './onboarding-application-review.component';

describe('OnboardingApplicationReviewComponent', () => {
  let component: OnboardingApplicationReviewComponent;
  let fixture: ComponentFixture<OnboardingApplicationReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingApplicationReviewComponent]
    });
    fixture = TestBed.createComponent(OnboardingApplicationReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
