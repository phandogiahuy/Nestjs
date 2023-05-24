import { SetMetadata } from '@nestjs/common/decorators';
import type { Policy } from 'src/authorization/policy/policy.interface';
export const POLICIES_KEY = 'policies';
export const Policies = (...policies: Policy[]) =>
  SetMetadata(POLICIES_KEY, policies);
