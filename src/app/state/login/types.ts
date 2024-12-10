export enum Role {
  User = 'User',
  Manager = 'Manager',
  Admin = 'Admin',
}

export type RegisterUser = {
  name: string;
  email: string;
  password: string;
};

export type LoginUser = {
  email: string;
  password: string;
};

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type AuthResponse = {
  message: string;
  user: AuthenticatedUser;
  token: string;
};
