import {
  Controller,
  Body,
  Get,
  Post,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ScraperService } from './scraper.service';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @UseGuards(AuthenticatedGuard)
  @Get()
  getScrapingResults(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.scraperService.getScrapingResults(page, limit);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/:id')
  async getUrlsByScrapingResultUrl(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Param('id') id: string,
  ) {
    return this.scraperService.getUrlsByScrapingResultUrl(id, page, limit);
  }

  @UseGuards(AuthenticatedGuard)
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
