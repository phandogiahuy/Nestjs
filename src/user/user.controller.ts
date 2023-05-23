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
import { ActiveUser } from 'src/decorators/active-user-decorator';
import { Auth } from 'src/decorators/auth-decorator';
import { AuthType } from 'src/enum/auth-type.enum';
import { ActiveUserData } from 'src/interface/active-user.interface';
import { UserDto } from 'src/report/dto/user.dto';
import { Serialize } from 'src/serialize/serialize.interceptor';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
@Controller('auth')
// @Serialize(UserDto)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
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
  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.userService.findAll();
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Get()
  findEmail(@Query('email') email: string) {
    this.userService.findEmail(email);
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Auth(AuthType.None)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
