import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapingResult, ScrapingResultDocument } from './scraper.schema';

@Injectable()
export class ScraperService {
  constructor(
    @InjectModel(ScrapingResult.name)
    private readonly scrapingResultModel: Model<ScrapingResultDocument>,
  ) {}

  async scrapeAndStore(url: string) {
    try {
      const worker = new Worker('./src/scraper/webScraper.js', {
        workerData: { url },
      });

      worker.on('message', async (result) => {
        try {
          // Create a new instance of ScrapingResult model
          const { title, links } = result;

          const newResult = new this.scrapingResultModel({
            url,
            title: title,
            links: links,
          });

          // Save the result to MongoDB
          await newResult.save();
        } catch (error) {
          console.log(error);
        }
      });

      worker.on('error', (error) => {
        console.log(error);
      });
      worker.on('exit', (code) => {
        if (code !== 0) {
          console.log(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      return { message: `Execution of scraper for ${url} successful` };
    } catch (error) {
      throw new Error('Error creating and starting worker');
    }
  }

  async getScrapingResults(page: number, limit: number) {
    const totalResults = await this.scrapingResultModel.countDocuments();

    const results = await this.scrapingResultModel
      .aggregate([
        {
          $project: {
            id: 1,
            title: 1,
            totalLinks: { $size: '$links' },
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ])
      .exec();

    return {
      totalResults,
      results,
    };
  }

  async getUrlsByScrapingResultUrl(id: string, page: number, limit: number) {
    const result = await this.scrapingResultModel
      .findById(id)
      .select('title links')
      .exec();

    const links = result.links || [];
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLinks = links.slice(startIndex, endIndex);

    return {
      title: result.title,
      totalResults: links.length,
      results: paginatedLinks,
    };
  }
}
