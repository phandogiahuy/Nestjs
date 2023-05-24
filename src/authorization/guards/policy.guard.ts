import type { CanActivate, ExecutionContext, Type } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/constant/authen.constant';
import { POLICIES_KEY } from 'src/decorators/policy.decorator';
import type { ActiveUserData } from 'src/interface/active-user.interface';

import type { Policy } from '../policy/policy.interface';
import { PolicyHandlerStorage } from '../policy/policy-handle.storage';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {}

  // Promise<boolean>

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextPolicies = this.reflector.getAllAndOverride<Policy[]>(
      POLICIES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!contextPolicies) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    await Promise.all(
      contextPolicies.map((policy) => {
        const policyHandler = this.policyHandlerStorage.get(
          policy.constructor as Type,
        );
        return policyHandler.handle(policy, user);
      }),
    ).catch((err) => {
      throw new ForbiddenException(err.message);
    });
    return true;
  }
}
