import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryIconDto {
  @IsString()
  displayName: string;
}

export class CategoryDto {
  @IsNumber()
  id: number;

  @ValidateNested()
  @Type(() => CategoryIconDto)
  icon: CategoryIconDto;

  @IsString()
  titleKey: string;

  @IsString()
  descriptionKey: string;
}

export class TellUsFormDto {
  @IsString()
  businessName: string;

  @IsString()
  businessUrl: string;

  @IsString()
  startDateMonth: string;

  @IsString()
  startDateYear: string;

  @IsString()
  businessLocation: string;

  @IsString()
  industry: string;

  @IsString()
  siteType: string;

  @IsString()
  currency: string;

  @IsString()
  annualRevenue: string;
}

export class CreateSellDto {
  @ValidateNested()
  @Type(() => CategoryDto)
  category: CategoryDto;

  @ValidateNested()
  @Type(() => TellUsFormDto)
  tellUsForm: TellUsFormDto;

  @IsArray()
  @IsString({ each: true })
  incomeSources: string[];
}
