import { Controller, Get, Render, UseGuards, Param } from '@nestjs/common';
import { AuthenticatedGuard } from './auth/authenticated.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthenticatedGuard)
  @Get()
  @Render('index')
  root() {
    return '';
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/detail/:id')
  @Render('detail')
  detail(@Param('id') id: string) {
    return { scrapedId: id };
  }

  @Get('signup')
  @Render('signup')
  register() {
    return '';
  }

  @Get('login')
  @Render('login')
  login() {
    return '';
  }
}
