import { Role } from '../enums';

export interface IUser {
  id: string;
  email: string;
  roles: Role[];
  permissions?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserTokenPayload {
  sub: string;
  email: string;
  roles: Role[];
  iat?: number;
  exp?: number;
}