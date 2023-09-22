import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ErrorPageComponent } from './error-page.component';

describe('ErrorPageComponent', () => {
  let component: ErrorPageComponent;
  let fixture: ComponentFixture<ErrorPageComponent>;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: {
              subscribe: (fn: (value: any) => void) => fn({ errorCode: '401' })
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPageComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should display the correct error code', () => {
    expect(component.errorCode).toBe('401');
  });

  it('should display the correct error information', () => {
    const expectedError = {
      title: 'Unauthorized',
      description: 'Token has expired, please log in again',
      img: 'https://www.shutterstock.com/image-illustration/number-401-on-yellow-pink-600w-1101355769.jpg'
    };

    expect(component.errorObj).toEqual(expectedError);
  });

  it('should display the error code title in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-title').textContent).toContain(component.errorObj.title);
  });

  it('should display the error code description in the template', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.error-description').textContent).toContain(component.errorObj.description);
  });

});
