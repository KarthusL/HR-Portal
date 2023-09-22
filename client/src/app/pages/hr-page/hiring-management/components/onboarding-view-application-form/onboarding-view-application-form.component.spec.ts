import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingViewApplicationFormComponent } from './onboarding-view-application-form.component';

describe('OnboardingViewApplicationFormComponent', () => {
  let component: OnboardingViewApplicationFormComponent;
  let fixture: ComponentFixture<OnboardingViewApplicationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingViewApplicationFormComponent]
    });
    fixture = TestBed.createComponent(OnboardingViewApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
