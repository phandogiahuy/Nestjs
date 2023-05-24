import { Injectable } from '@nestjs/common';
import type { ActiveUserData } from 'src/interface/active-user.interface';

import type { Policy } from './policy.interface';
import type { PolicyHandler } from './policy-handle.interface';
import { PolicyHandlerStorage } from './policy-handle.storage';

export class FrameworkContributorPolicy implements Policy {
  name = 'FrameworkContributor';
}
@Injectable()
export class FrameworkContributorPolicyHandler
  implements PolicyHandler<FrameworkContributorPolicy>
{
  constructor(private readonly policyHandlerStorage: PolicyHandlerStorage) {
    this.policyHandlerStorage.add(FrameworkContributorPolicy, this);
  }

  async handle(
    policy: FrameworkContributorPolicy,
    user: ActiveUserData,
  ): Promise<void> {
    const isContrubutor = user.email.endsWith('@nestjs.com');
    if (!isContrubutor) {
      throw new Error('user is not a contributor');
    }
  }
}
