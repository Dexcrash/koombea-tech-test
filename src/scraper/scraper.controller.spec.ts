import { Test, TestingModule } from '@nestjs/testing';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ScrapingResult } from './scraper.schema';
import { getModelToken } from '@nestjs/mongoose';

const scraperModel = {
  url: 'testuser',
  title: 'test12345',
  links: [
    {
      url: 'example.com',
      name: 'example',
    },
  ],
};

class ScraperModel {
  constructor(private data) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockResolvedValue([scraperModel]);
  static findOne = jest.fn().mockResolvedValue(scraperModel);
  static findOneAndUpdate = jest.fn().mockResolvedValue(scraperModel);
  static deleteOne = jest.fn().mockResolvedValue(true);
}

describe('ScraperController', () => {
  let controller: ScraperController;
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScraperController],
      providers: [
        ScraperService,
        {
          provide: getModelToken(ScrapingResult.name),
          useValue: ScraperModel,
        },
      ],
    }).compile();

    controller = module.get<ScraperController>(ScraperController);
    service = module.get<ScraperService>(ScraperService);
  });

  describe('getScrapingResults', () => {
    it('should return scraping results with default page and limit', async () => {
      // Arrange
      const expectedResults = {
        totalResults: 18,
        results: [
          {
            _id: '64704d050db7be868c4a0796',
            title: 'Node.js - Wikipedia',
            totalLinks: 839,
          },
          {
            _id: '64705a688005db0c8b1cca53',
            title:
              'The Ultimate Guide to Web Scraping with Node.jsDaniel NiDaniel Ni',
            totalLinks: 60,
          },
        ],
      };
      jest
        .spyOn(service, 'getScrapingResults')
        .mockResolvedValueOnce(expectedResults);

      // Act
      const result = await controller.getScrapingResults(null);

      // Assert
      expect(result).toBe(expectedResults);
    });
  });

  describe('getUrlsByScrapingResultUrl', () => {
    it('should return URLs by scraping result URL with default page and limit', async () => {
      // Arrange
      const expectedUrls = {
        title: 'Node.js - Wikipedia',
        totalResults: 839,
        results: [
          {
            url: '/wiki/Special:MyContributions',
            name: '<span>Contributions</span>',
            _id: '64704d050db7be868c4a07ab',
          },
          {
            url: '/wiki/Special:MyTalk',
            name: '<span>Talk</span>',
            _id: '64704d050db7be868c4a07ac',
          },
          {
            url: '#',
            name: '\n\t\t\t\t<div class="vector-toc-text">(Top)</div>\n\t\t\t',
            _id: '64704d050db7be868c4a07ad',
          },
        ],
      };

      const id = '123';
      jest
        .spyOn(service, 'getUrlsByScrapingResultUrl')
        .mockResolvedValueOnce(expectedUrls);

      // Act
      const result = await controller.getUrlsByScrapingResultUrl(null, id);

      // Assert
      expect(result).toBe(expectedUrls);
      expect(service.getUrlsByScrapingResultUrl).toHaveBeenCalledWith(
        id,
        1,
        10,
      );
    });
  });

  describe('scrape', () => {
    it('should scrape and store the URL and return the result', async () => {
      // Arrange
      const url = 'http://example.com';

      const serviceMessage = {
        message: `Execution of scraper for ${url} successful`,
      };
      jest
        .spyOn(service, 'scrapeAndStore')
        .mockResolvedValueOnce(serviceMessage);

      // Act
      const result = await controller.scrape(url);

      // Assert
      expect(result).toEqual(serviceMessage);
      expect(service.scrapeAndStore).toHaveBeenCalledWith(url);
    });

    it('should handle and return error message if an error occurs during scraping', async () => {
      // Arrange
      const url = 'http://example.com';
      const errorMessage = 'Scraping error';
      jest
        .spyOn(service, 'scrapeAndStore')
        .mockRejectedValueOnce(new Error(errorMessage));

      // Act
      const result = await controller.scrape(url);

      // Assert
      expect(result).toThrowError();
      expect(service.scrapeAndStore).toHaveBeenCalledWith(url);
    });
  });
});
