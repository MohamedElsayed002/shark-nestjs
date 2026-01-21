import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RevenueProofDto {
  @IsString()
  fileUrl: string;

  @IsString()
  fileId: string;

  @IsIn(['screenshot', 'pdf', 'csv'])
  fileType: string;

  @IsOptional()
  @IsString()
  source?: string; // stripe, paypal, adsense...
}

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  // usually injected from token, not from body
  @IsOptional()
  @IsMongoId()
  owner?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  imageId?: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  // ---------- Financial ----------

  @IsOptional()
  @IsBoolean()
  isProfitable?: boolean;

  @IsOptional()
  @IsNumber()
  averageMonthlyRevenue?: number;

  @IsOptional()
  @IsNumber()
  averageMonthlyExpenses?: number;

  // ❌ better calculated in backend, not sent from client
  @IsOptional()
  @IsNumber()
  netProfit?: number;

  // ---------- Income Sources ----------

  @IsOptional()
  @IsArray()
  @IsIn(
    [
      'adsense',
      'subscriptions',
      'digital_products',
      'affiliate',
      'services',
      'apps',
    ],
    { each: true },
  )
  incomeSources?: string[];

  // ---------- Revenue Proofs ----------

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RevenueProofDto)
  revenueProofs?: RevenueProofDto[];

  // ---------- Verification ----------

  @IsOptional()
  @IsBoolean()
  platformVerificationRequested?: boolean;

  @IsOptional()
  @IsIn(['basic', 'approved', 'rejected'])
  verificationLevel?: 'basic' | 'approved' | 'rejected';
}
