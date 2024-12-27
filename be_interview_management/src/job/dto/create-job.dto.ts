import { ToNumber, ToNumbers, Trim } from '@/base/decorators/common.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { JobLevel, JobStatus } from '../job.constant';
import { UserDepartment } from '@/user/user.constant';

export class CreateJobDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsOptional()
  @IsString()
  @Trim()
  working_address: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  start_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ToNumber()
  salary_from: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ToNumber()
  salary_to: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  currency: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  end_date: string;

  @ApiProperty({ example: ['a', 'b', 'c'] })
  @IsNotEmpty()
  @IsString({ each: true })
  @IsArray()
  skills: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString({ each: true })
  position: string;

  @ApiProperty({ example: JobStatus })
  @IsNotEmpty()
  @IsEnum(JobStatus)
  @Trim()
  status: JobStatus;

  @ApiProperty({
    isArray: true,
    enum: JobLevel,
    example: [JobLevel.Junior, JobLevel.Senior],
  })
  @IsNotEmpty()
  @IsArray()
  @IsEnum(JobLevel, { each: true })
  level: JobLevel[];

  @ApiPropertyOptional({
    enum: UserDepartment,
  })
  @IsOptional()
  @IsEnum(UserDepartment)
  @Trim()
  department: UserDepartment;
}
