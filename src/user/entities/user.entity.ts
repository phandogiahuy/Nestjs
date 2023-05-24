import type { PermissionType } from 'src/authorization/guards/permission.type';
import { Permission } from 'src/authorization/guards/permission.type';
import {
  AfterInsert,
  AfterRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '../enum/role.enum';
import { UserPermission } from '../user.permission';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInser() {
    return 'Insert';
  }

  @AfterRemove()
  logRemove() {
    return 'Remove';
  }

  @Column({ enum: Role, default: Role.Regular })
  role: Role;

  // @Column({ enum: UserPermission })
  // permissions: UserPermission;
}
