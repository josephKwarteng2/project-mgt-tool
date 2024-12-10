import { AuthResponse } from './types';

export interface LoginStateModel {
  user: AuthResponse | null;
  error: string | null;
  isLoggingIn: boolean;
}
