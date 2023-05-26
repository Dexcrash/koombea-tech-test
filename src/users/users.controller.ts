import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //post/ signup
  @Post('/signup')
  async addUser(
    @Body('password') userPassword: string,
    @Body('username') userName: string,
  ) {
    const result = await this.usersService.insertUser(userName, userPassword);
    return {
      msg: 'User successfully registered',
      userName: result.username,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@Request() req): any {
    return { user: req.user, msg: 'User logged in' };
  }

  //Get / protected
  @UseGuards(AuthenticatedGuard)
  @Get('/protected')
  getHello(@Request() req): string {
    return req.user;
  }

  //Get / logout
  @Get('/logout')
  logout(@Request() req): any {
    req.session.destroy();
    return { msg: 'The user session has ended' };
  }
}
