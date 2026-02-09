import { IsMongoId, IsOptional } from 'class-validator';

export class CreateConversationDto {
  @IsMongoId()
  sellerId: string;

  @IsOptional()
  @IsMongoId()
  serviceId?: string;
}
