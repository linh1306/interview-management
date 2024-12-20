import { Module } from '@nestjs/common';
import { StatiticService } from './statitic.service';
import { StatiticController } from './statitic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from '@/candidate/entities/candidate.entity';
import { Job } from '@/job/entities/job.entity';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Job, InterviewSchedule])],
  controllers: [StatiticController],
  providers: [StatiticService],
})
export class StatiticModule {}
