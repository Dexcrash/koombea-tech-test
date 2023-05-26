import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ScrapingResult, ScrapingResultSchema } from './scraper.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScrapingResult.name, schema: ScrapingResultSchema },
    ]),
  ],
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
