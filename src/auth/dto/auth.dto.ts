import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateOnboardingDto {
  @IsEnum(['buyer', 'seller', 'find_partner'], { message: 'Invalid account type' })
  accountType: 'buyer' | 'seller' | 'find_partner';

  @IsNotEmpty() @IsString()
  firstName: string;

  @IsNotEmpty() @IsString()
  lastName: string;

  @IsNotEmpty() @IsString()
  country: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsString() @MaxLength(2000)
  partnerDescription?: string;

  @IsOptional() @IsString()
  companyName?: string;

  @IsOptional() @IsString()
  howHeard?: string;

  @IsOptional() @IsString()
  businessUrl?: string;

  @IsOptional() @IsString()
  category?: string;

  @IsOptional() @IsString()
  annualRevenue?: string;

  @IsOptional() @IsString()
  annualProfit?: string;

  @IsOptional() @IsString()
  businessesCount?: string;
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(['Male', 'Female'], { message: 'Gender must be Male or Female' })
  gender?: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}

export class UploadImageDto {
  @IsNotEmpty() @IsString()
  imageUrl: string;
}
