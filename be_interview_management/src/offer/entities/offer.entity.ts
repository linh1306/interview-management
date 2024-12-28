import { AbstractEntity } from '@/base/service/abstract-entity.service';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import {
  OfferLevel,
  OfferPosition,
  OfferStatus,
  OfferType,
} from '../offer.constant';
import { UserDepartment } from '@/user/user.constant';
import { Candidate } from '@/candidate/entities/candidate.entity';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';
import { User } from '@/user/entities/user.entity';

@Entity()
export class Offer extends AbstractEntity {
  @Column()
  basic_salary: number;

  @Column()
  contract_from: Date;

  @Column()
  contract_to: Date;

  @Column({ type: 'enum', enum: OfferType })
  contract_type: OfferType;

  @Column({ type: 'enum', enum: UserDepartment })
  department: UserDepartment;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  note: string;

  @Column({ type: 'enum', enum: OfferPosition })
  position: OfferPosition;

  @Column({ type: 'enum', enum: OfferLevel })
  level: OfferLevel;

  @Column()
  status: string;

  @ManyToOne(() => User, (manager) => manager.offers)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @ManyToOne(() => Candidate, (candidate) => candidate.offers)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ManyToOne(
    () => InterviewSchedule,
    (interviewSchedule) => interviewSchedule.offers,
  )
  @JoinColumn({ name: 'interview_schedule_id' })
  interview_schedule: InterviewSchedule;
}
