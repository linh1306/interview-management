import { Module } from '@nestjs/common';
import { InterviewScheduleService } from './interview_schedule.service';
import { InterviewScheduleController } from './interview_schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewSchedule } from './entities/interview_schedule.entity';
import { Candidate } from '@/candidate/entities/candidate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InterviewSchedule, Candidate])],
  controllers: [InterviewScheduleController],
  providers: [InterviewScheduleService],
})
export class InterviewScheduleModule {}
