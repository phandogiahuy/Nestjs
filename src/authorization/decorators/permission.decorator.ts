import { SetMetadata } from '@nestjs/common';

import type { PermissionType } from '../guards/permission.type';
export const PERMISSION_KEY = 'permission';
export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(PERMISSION_KEY, permissions);
