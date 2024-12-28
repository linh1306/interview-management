import { ToNumber, Trim } from '@/base/decorators/common.decorator';
import { UserDepartment } from '@/user/user.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { OfferLevel, OfferPosition, OfferType } from '../offer.constant';

export class CreateOfferDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  candidate_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  interview_schedule_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(UserDepartment)
  @Trim()
  department: UserDepartment;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OfferPosition)
  @Trim()
  position: OfferPosition;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OfferLevel)
  @Trim()
  level: OfferLevel;

  @ApiProperty({ enum: OfferType })
  @IsNotEmpty()
  @IsEnum(OfferType)
  @Trim()
  contract_type: OfferType;

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsString()
  // @Trim()
  // due_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  contract_from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  contract_to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  basic_salary: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  manager_id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  currency: string;
}
