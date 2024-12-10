import { AuthResponse } from './types';
import { LoginUser } from './types';

export namespace LoginActions {
  export class Login {
    static readonly type = '[Login] Login';
    constructor(public payload: LoginUser) {}
  }

  export class LoginSuccess {
    static readonly type = '[Login] Login Success';
    constructor(public payload: AuthResponse) {}
  }

  export class LoginFailure {
    static readonly type = '[Login] Login Failure';
    constructor(public payload: string) {}
  }
}
