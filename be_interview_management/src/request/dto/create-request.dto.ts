import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsString, IsNumber, IsArray, IsDateString, IsOptional } from 'class-validator';
import { Trim, ToNumber } from '@/base/decorators/common.decorator';
import { RequestStatus, RequestLevel } from '../request.constant';

export class CreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  position: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ToNumber()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  workplace: string;

  @ApiProperty({ isArray: true, enum: RequestLevel })
  @IsArray()
  @IsEnum(RequestLevel, { each: true })
  level: RequestLevel[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  department: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  @Trim()
  description: string;

  @ApiProperty()
  @IsDateString()
  start_date: string;

  @ApiProperty()
  @IsDateString()
  end_date: string;

  @ApiPropertyOptional({ enum: RequestStatus })
  @IsOptional()
  @IsEnum(RequestStatus)
  status: RequestStatus;
}