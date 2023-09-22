import { login, logout } from "../actions/user.actions";
import { createReducer, on } from "@ngrx/store";
import { LoggedInUser } from "../actions/user.actions";

export interface UserState {
  user: LoggedInUser | null;
}

export const initialState: UserState = {
  user: null,
}

export const userReducer = createReducer(
  initialState,
  on(login, (state, { user }) => ({ ...state, user })),
  on(logout, (state) => ({...state, user: null}))
)