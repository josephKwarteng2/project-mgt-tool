import { State, Action, StateContext, Selector } from '@ngxs/store';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../shared/services/api.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LoginActions } from './login.actions';
import { LoginStateModel } from './login-state.model';
import { inject } from '@angular/core';
import { of } from 'rxjs';

const loginState: LoginStateModel = {
  user: null,
  error: null,
  isLoggingIn: false,
};

@State<LoginStateModel>({
  name: 'login',
  defaults: { ...loginState },
})
export class LoginState {
  private readonly authService = inject(AuthService);
  private readonly localStorageService = inject(LocalStorageService);

  @Selector()
  static isLoading(state: LoginStateModel): boolean {
    return state.isLoggingIn;
  }

  @Selector()
  static authenticatedUser(state: LoginStateModel) {
    return state.user?.user || null;
  }

  @Selector()
  static token(state: LoginStateModel) {
    return state.user?.token || null;
  }

  @Selector()
  static error(state: LoginStateModel): string | null {
    return state.error;
  }

  @Action(LoginActions.Login)
  login(ctx: StateContext<LoginStateModel>, action: LoginActions.Login) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isLoggingIn: true,
      error: null,
    });

    return this.authService.login(action.payload).pipe(
      tap((response) => {
        ctx.dispatch(new LoginActions.LoginSuccess(response));
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.dispatch(
          new LoginActions.LoginFailure(error.message || 'Login failed')
        );
        return of(error);
      })
    );
  }

  @Action(LoginActions.LoginSuccess)
  loginSuccess(
    ctx: StateContext<LoginStateModel>,
    action: LoginActions.LoginSuccess
  ) {
    const state = ctx.getState();
    this.localStorageService.setLocalItem('authToken', action.payload.token);
    this.localStorageService.setLocalItem(
      'authenticatedUser',
      action.payload.user
    );

    ctx.setState({
      ...state,
      user: action.payload,
      isLoggingIn: false,
      error: null,
    });
  }

  @Action(LoginActions.LoginFailure)
  loginFailure(
    ctx: StateContext<LoginStateModel>,
    action: LoginActions.LoginFailure
  ) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      isLoggingIn: false,
      error: action.payload,
    });
  }

  ngxsOnInit(ctx: StateContext<LoginStateModel>) {
    const token = this.localStorageService.getLocalItem('authToken');
    const user = this.localStorageService.getLocalItem('authenticatedUser');

    if (token && user) {
      ctx.setState({
        ...ctx.getState(),
        user: { token, user, message: 'Persisted login' },
        isLoggingIn: false,
        error: null,
      });
    }
  }
}
