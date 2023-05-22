import { Inject, Injectable } from '@nestjs/common/decorators';
import { UserService } from './user.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config/dist/types/config.type';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private userService: UserService,
    private jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguaration: ConfigType<typeof jwtConfig>,
  ) {}
  async signup(email: string, password: string) {
    const User = await this.userService.findEmail(email);
    if (User.length) {
      throw new BadRequestException('Email existed');
    }
    //salt
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
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
      const accesToken = await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          audience: this.jwtConfiguaration.audience,
          issuer: this.jwtConfiguaration.issuer,
          secret: this.jwtConfiguaration.secret,
          expiresIn: this.jwtConfiguaration.accessTokenTtl,
        },
      );
      return { user, accesToken };
    } else {
      throw new BadRequestException('bad password');
    }
  }
}
