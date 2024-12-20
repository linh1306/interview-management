import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Candidate } from '@/candidate/entities/candidate.entity';
import { Job } from '@/job/entities/job.entity';
import { Offer } from '@/offer/entities/offer.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { InterviewStatus } from '../interview_schedule.constant';

@Entity()
export class InterviewSchedule extends AbstractEntity {
  @Column({ nullable: true })
  interview_result: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  meeting_room: string;

  @Column({ default: '' })
  note: string;

  @Column()
  schedule_date: Date;

  @Column()
  schedule_time_from: string;

  @Column()
  schedule_time_to: string;

  @Column()
  title: string;

  @Column()
  position: string;

  @Column({
    type: 'enum',
    enum: InterviewStatus,
    default: InterviewStatus.Open,
  })
  status: InterviewStatus;

  @ManyToOne(() => Candidate, (candidate) => candidate.interview_schedules)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ManyToOne(() => Job, (job) => job.interview_schedules)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToMany(() => User, (interviewer) => interviewer.interview_schedules)
  @JoinTable({
    name: 'interviewer_schedule',
    joinColumn: { name: 'interview_schedule_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'interview_id', referencedColumnName: 'id' },
  })
  interviewers: User[];

  @OneToMany(() => Offer, (offer) => offer.interview_schedule)
  offers: Offer[];
}
