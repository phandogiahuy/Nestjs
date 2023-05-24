import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/constant/authen.constant';
import type { ActiveUserData } from 'src/interface/active-user.interface';

import { PERMISSION_KEY } from '../decorators/permission.decorator';
import type { PermissionType } from './permission.type';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Promise<boolean>

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextPermission = this.reflector.getAllAndOverride<
      PermissionType[]
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()]);
    if (!contextPermission) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    return contextPermission.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
