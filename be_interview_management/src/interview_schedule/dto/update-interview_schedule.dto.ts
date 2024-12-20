import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateInterviewScheduleDto } from './create-interview_schedule.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { InterviewStatus } from '../interview_schedule.constant';
import { Trim } from '@/base/decorators/common.decorator';

export class UpdateInterviewScheduleDto extends PartialType(
  CreateInterviewScheduleDto,
) {}
