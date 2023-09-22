import { createAction, props } from '@ngrx/store';

export interface LoggedInUser {
  uname: string,
  email: string,
  role: 'hr' | 'regular'
}

// Action Types
export const login = createAction(
  '[Auth] Login Success',
  props<{ user: LoggedInUser }>()
);

export const logout = createAction('[Auth] Logout Success');


