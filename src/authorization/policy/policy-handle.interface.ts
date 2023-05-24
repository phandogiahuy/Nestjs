import type { ActiveUserData } from 'src/interface/active-user.interface';

import type { Policy } from './policy.interface';

export interface PolicyHandler<T extends Policy> {
  handle(policy: T, user: ActiveUserData): Promise<void>;
}
