import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttachmentDto {
  @IsUrl()
  url: string;

  @IsString()
  name: string;
}

export class CreateHelpCenterDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  listingUrl?: string;

  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true, message: 'Each attachment URL must be a valid URL' })
  attachmentUrls?: string[];
}
