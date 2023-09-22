import { Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { ErrorService } from 'src/app/services/error-service.service';
import { Store, select } from '@ngrx/store';
import { login } from 'src/app/store/actions/user.actions';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private errorService: ErrorService,
    private router: Router,
    private store: Store,
    private http: HttpClient) {}

  canActivate: CanActivateFn = async (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> => {

    const token = localStorage.getItem('ACCESS_TOKEN');
    const path = route.routeConfig?.path;

    if (token) {
      try {
        const res: any = await firstValueFrom(this.http.get('api/auth/check_token', { observe: 'response' }));
        const { role, email, uname } = res.body;
        this.store.dispatch(login({user: {uname, email, role}}));
        if ((role === 'hr' && path !== 'hr') || (role === 'normal' && path !== 'employee')) {
          this.errorService.redirectToErrorPage(403);
          return false;
        }
      } catch (err: any) {
        console.error(err);
        this.errorService.redirectToErrorPage(err.status);
      }
      // user authorized
      return true;
    } else {
      // User token has expired, redirect to log in page
      this.router.navigate(['/']);
      return false;
    }
  };
}