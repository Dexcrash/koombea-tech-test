import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { QueryScrapingResultDto } from '../utils/QueryPaginationDto';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get()
  getScrapingResults(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryScrapingResultDto,
  ) {
    return this.scraperService.getScrapingResults(query.page, query.limit);
  }

  @Get('/:id')
  async getUrlsByScrapingResultUrl(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryScrapingResultDto,
    @Param('id') id: string,
  ) {
    return this.scraperService.getUrlsByScrapingResultUrl(
      id,
      query.page,
      query.limit,
    );
  }

  @Post('/scrape')
  async scrape(@Body('url') url: string) {
    try {
      const result = await this.scraperService.scrapeAndStore(url);
      return { result };
    } catch (error) {
      return { error: error.message };
    }
  }
}
