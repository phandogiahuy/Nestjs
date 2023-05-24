import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesstokenGuardGuard } from 'src/accesstoken-guard/accesstoken-guard.guard';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { PolicyGuard } from 'src/authorization/guards/policy.guard';
import { PermissionGuard } from 'src/authorization/guards/role.guard';
import { FrameworkContributorPolicyHandler } from 'src/authorization/policy/framework-contributor.policy';
import { PolicyHandlerStorage } from 'src/authorization/policy/policy-handle.storage';
// import { PermissionGuard } from 'src/authorization/guards/role.guard';
import jwtConfig from 'src/config/jwt.config';
import { RoleGuard } from 'src/guard/role/role.guard';
import { RefreshTokenStorage } from 'src/user/refresh-token-storage/refresh-token-storage';

import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    PolicyHandlerStorage,
    AccesstokenGuardGuard,
    AuthService,
    RefreshTokenStorage,
    FrameworkContributorPolicyHandler,
  ],
})
export class UserModule {}
