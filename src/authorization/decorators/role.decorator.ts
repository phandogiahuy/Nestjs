import { SetMetadata } from '@nestjs/common';
import type { Role } from 'src/user/enum/role.enum';

export const ROLE_KEY = 'role';
export const Roles = (...role: Role[]) => SetMetadata(ROLE_KEY, role);
