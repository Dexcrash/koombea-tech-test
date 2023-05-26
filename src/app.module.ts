import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScraperModule } from './scraper/scraper.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ScraperModule,
    MongooseModule.forRoot(
      'mongodb+srv://dexcrash:ZtRIjba1U1YB2DJn@scrapperdb.yqy2owc.mongodb.net/',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
