import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { JobLevel, JobStatus } from '../job.constant';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';
import { UserDepartment } from '@/user/user.constant';

@Entity()
export class Job extends AbstractEntity {
  @Column({ default: '' })
  description: string;

  @Column()
  end_date: Date;

  @Column({ enum: JobLevel, type: 'enum', array: true })
  level: JobLevel[];

  @Column()
  title: string;

  @Column({ nullable: true })
  currency: string;

  @Column()
  salary_from: number;

  @Column()
  salary_to: number;

  @Column()
  start_date: Date;

  @Column({ nullable: true })
  working_address: string;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.Draft })
  status: JobStatus;

  @Column()
  position: string;

  @Column('text', { nullable: true, array: true })
  skills: string[];

  @Column({ type: 'enum', enum: UserDepartment, nullable: true })
  department: UserDepartment;

  @OneToMany(() => InterviewSchedule, (is) => is.job)
  interview_schedules: InterviewSchedule[];
}
