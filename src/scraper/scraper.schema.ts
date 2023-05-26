import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScrapingResultDocument = ScrapingResult & Document;

@Schema()
export class ScrapingResult {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  title: string;

  @Prop([
    {
      url: String,
      name: String,
    },
  ])
  links: { url: string; name: string }[];
}

export const ScrapingResultSchema =
  SchemaFactory.createForClass(ScrapingResult);
