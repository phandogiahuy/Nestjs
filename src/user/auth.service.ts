import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common/decorators';
import { ConfigType } from '@nestjs/config/dist/types/config.type';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, randomUUID, scrypt as _scrypt } from 'crypto';
import jwtConfig from 'src/config/jwt.config';
import type { ActiveUserData } from 'src/interface/active-user.interface';
import {
  InvalidateRefreshTokenError,
  RefreshTokenStorage,
} from 'src/user/refresh-token-storage/refresh-token-storage';
import { Repository } from 'typeorm';
import { promisify } from 'util';

import type { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
const scrypt = promisify(_scrypt);
@Injectable()
// @Auth(AuthType.None)
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguaration: ConfigType<typeof jwtConfig>,
    private readonly refreshtokenIdStorage: RefreshTokenStorage,
  ) {}

  async signup(email: string, password: string) {
    const User = await this.userService.findEmail(email);
    if (User.length) {
      throw new BadRequestException('Email existed');
    }
    //salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = `${salt}.${hash.toString('hex')}`;
    const user = await this.userService.create({ email, password: result });
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.findEmail(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash === hash.toString('hex')) {
      return this.generateToken(user);
    } else {
      throw new BadRequestException('bad password');
    }
  }

  private async generateToken(user: User) {
    const refreshTokenId = randomUUID();
    const [accesToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user,
        this.jwtConfiguaration.accessTokenTtl,
        { email: user.email, role: user.role },
        // , permissions: user.permissions
      ),
      this.signToken(user, this.jwtConfiguaration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.refreshtokenIdStorage.insert(user.id, refreshTokenId);
    return { accesToken, refreshToken };
  }

  private async signToken<T>(user: User, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        ...payload,
      },
      {
        audience: this.jwtConfiguaration.audience,
        issuer: this.jwtConfiguaration.issuer,
        secret: this.jwtConfiguaration.secret,
        expiresIn,
      },
    );
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguaration.secret,
        audience: this.jwtConfiguaration.audience,
        issuer: this.jwtConfiguaration.issuer,
      });
      const user = await this.userRepository.findOneByOrFail({ id: sub });
      const isValid = await this.refreshtokenIdStorage.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.refreshtokenIdStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return await this.generateToken(user);
    } catch (err) {
      if (err instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }
}
