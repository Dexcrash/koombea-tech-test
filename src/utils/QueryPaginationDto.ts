import { IsNumber, IsOptional } from 'class-validator';

export class QueryScrapingResultDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  limit?: number = 10;
}
