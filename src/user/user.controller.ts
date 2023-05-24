import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { Permissions } from 'src/authorization/decorators/permission.decorator';
import { ROLE_KEY, Roles } from 'src/authorization/decorators/role.decorator';
import { Permission } from 'src/authorization/guards/permission.type';
import { FrameworkContributorPolicy } from 'src/authorization/policy/framework-contributor.policy';
import { ActiveUser } from 'src/decorators/active-user-decorator';
import { Auth } from 'src/decorators/auth-decorator';
import { Policies } from 'src/decorators/policy.decorator';
import { AuthType } from 'src/enum/auth-type.enum';
import { ActiveUserData } from 'src/interface/active-user.interface';
import { Serialize } from 'src/serialize/serialize.interceptor';
import { UserDto } from 'src/user/dto/user.dto';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './enum/role.enum';
import { UserService } from './user.service';
@Controller('auth')
// @Serialize(UserDto)
@Auth(AuthType.None)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  // @Permissions(Permission.CreateUser)
  create(@Body() body: CreateUserDto) {
    return this.authService.signup(body.email, body.password);
  }

  @Auth(AuthType.None)
  @Post('/signin')
  async signin(
    @Res({ passthrough: true }) response: Response,
    @Body() body: CreateUserDto,
  ) {
    const accesToken = await this.authService.signin(body.email, body.password);
    response.cookie('accesToken', accesToken, {
      secure: true,
      httpOnly: true,
      sameSite: true,
    });
    return accesToken;
  }

  @Auth(AuthType.Bearer)
  @Roles(Role.Admin)
  // @Policies(new FrameworkContributorPolicy())
  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.userService.findAll();
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  // @Roles(Role.Admin)
  // @Permissions(Permission.DeleteUser)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Get()
  findEmail(@Query('email') email: string) {
    this.userService.findEmail(email);
  }

  // @Auth(AuthType.Bearer)
  // @Roles(Role.Admin)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
