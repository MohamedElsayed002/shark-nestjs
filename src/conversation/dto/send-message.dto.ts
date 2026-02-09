import { IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @MinLength(1, { message: 'Message content cannot be empty' })
  @MaxLength(4000, { message: 'Message content cannot exceed 4000 characters' })
  content: string;
}
