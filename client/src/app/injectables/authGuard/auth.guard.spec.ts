import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ErrorService } from 'src/app/services/error-service.service';

describe('AuthMiddleware', () => {
  let middleware: AuthGuard;
  let mockRouter: any;
  let mockErrorService: any;

  beforeEach(() => {
    mockRouter = {
      parseUrl: jasmine.createSpy('parseUrl')
    };
    mockErrorService = {
      redirectToErrorPage: jasmine.createSpy('redirectToErrorPage')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: ErrorService, useValue: mockErrorService }
      ]
    });

    middleware = TestBed.inject(AuthGuard);
  });

  it('should allow access when the user is authorized', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

    const result: boolean | UrlTree = middleware.canActivate(mockRoute, mockState) as boolean | UrlTree;

    expect(result).toBeTrue();
  });

  it('should redirect to the error page when the user is unauthorized', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const mockRoute: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockState: RouterStateSnapshot = {} as RouterStateSnapshot;

    const result: boolean | UrlTree = middleware.canActivate(mockRoute, mockState) as boolean | UrlTree;

    expect(mockErrorService.redirectToErrorPage).toHaveBeenCalledWith(401);
    // expect(mockRouter.parseUrl).toHaveBeenCalledWith('/error/401');
    // expect(result).toEqual(mockRouter.parseUrl('/error/401'));
  });
});
