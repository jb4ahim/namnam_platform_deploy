import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../interfaces';

export const CurrentUser = createParamDecorator(
  (data: keyof IUser | undefined, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IUser;

    if (!user) {
      throw new Error('User not found in request. Ensure authentication guard is applied.');
    }

    if (data) {
      const value = user[data];
      if (typeof value === 'undefined') {
        throw new Error(`Property "${String(data)}" does not exist on user.`);
      }
      // Return the property value directly, preserving its type
      return value;
    }

    return user;
  }

// Alternative decorator for optional user (when route might be public but we want user if available)
export const OptionalUser = createParamDecorator(
  (data: keyof IUser | undefined, ctx: ExecutionContext): IUser | null => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as IUser | undefined;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);