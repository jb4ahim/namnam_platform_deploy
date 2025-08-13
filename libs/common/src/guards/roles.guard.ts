import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, RoleHierarchy } from '../enums/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request?.user as { roles?: Role[] } | undefined;

    if (!user?.roles || user.roles.length === 0) {
      throw new ForbiddenException('Insufficient role');
    }

    // Allow if any of the user's roles satisfies one of the required roles
    const hasRole = user.roles.some((userRole) => {
      return requiredRoles.some((required) => RoleHierarchy[userRole] >= RoleHierarchy[required]);
    });

    if (!hasRole) {
      throw new ForbiddenException('Insufficient role');
    }

    return true;
  }
}


