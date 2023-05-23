import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccesstokenGuardGuard } from 'src/accesstoken-guard/accesstoken-guard.guard';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import jwtConfig from 'src/config/jwt.config';

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
    AccesstokenGuardGuard,
    AuthService,
  ],
})
export class UserModule {}
