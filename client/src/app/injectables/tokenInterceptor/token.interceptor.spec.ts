import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TokenInterceptor } from './token.interceptor';

beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      HttpClient,
      { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ]
  });
});

it('should add Authorization header with token to requests', inject(
  [HttpClient, HttpTestingController],
  (http: HttpClient, httpMock: HttpTestingController) => {
    const dummyResponse = { data: 'test' };
    const token = 'your-token';

    // Make a request that should be intercepted
    http.get('/api/data').subscribe((response: any) => {
      expect(response).toEqual(dummyResponse);
    });

    // Expect the intercepted request
    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

    // Respond with dummy data
    req.flush(dummyResponse);

    // Verify that there are no outstanding requests
    httpMock.verify();
  }
));
