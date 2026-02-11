import {
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoryDto, TellUsFormDto } from './create-sell.dto';

export class UpdateSellDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryDto)
  category?: CategoryDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TellUsFormDto)
  tellUsForm?: TellUsFormDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  incomeSources?: string[];
}
