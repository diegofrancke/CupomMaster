export interface User {
  id?: number;
  username: string;
  email: string;
  telefone?: string;
  role: UserRole;
  createdAt?: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  telefone?: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}
