import { ToNumber, ToNumbers, Trim } from '@/base/decorators/common.decorator';
import { OfferPosition } from '@/offer/offer.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { InterviewStatus } from '../interview_schedule.constant';

export class CreateInterviewScheduleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  candidate_id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsPositive()
  @ToNumber()
  job_id: number;

  @ApiProperty({ example: [1, 2, 3] })
  @IsNotEmpty()
  @IsPositive({ each: true })
  @ToNumbers()
  interviewer_ids: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  schedule_time_from: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  schedule_time_to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  schedule_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Trim()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  note: string;

  @ApiProperty({ enum: OfferPosition, example: OfferPosition.Be })
  @IsNotEmpty()
  @IsEnum(OfferPosition)
  @Trim()
  position: OfferPosition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Trim()
  meeting_room: string;

  @ApiPropertyOptional({ enum: InterviewStatus })
  @IsEnum(InterviewStatus)
  @Trim()
  @IsOptional()
  status: InterviewStatus;
}
