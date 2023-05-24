import type { PermissionType } from 'src/authorization/guards/permission.type';
import type { Role } from 'src/user/enum/role.enum';
import type { UserPermission } from 'src/user/user.permission';

export interface ActiveUserData {
  sub: number;
  email: string;
  role: Role;
  permissions: UserPermission;
}
