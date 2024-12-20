import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { OfferPosition } from '@/offer/offer.constant';
import { EGender, UserDepartment } from '@/user/user.constant';
import { Column, Entity, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { CandidateStatus, HighetsLevelCandidate } from '../candidate.constant';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';
import { Offer } from '@/offer/entities/offer.entity';
@Entity()
export class Candidate extends AbstractEntity {
  @Column({ default: '' })
  address: string;

  @Column({ nullable: true })
  attach_file: string;

  @Column({ type: 'enum', enum: OfferPosition })
  position: OfferPosition;

  @Column()
  dob: Date;

  @Column()
  email: string;

  @Column()
  full_name: string;

  @Column()
  phone: string;

  @Column({ default: 0 })
  year_experience: number;

  @Column({ type: 'enum', enum: EGender, default: EGender.Other })
  gender: EGender;

  @Column({
    type: 'enum',
    enum: CandidateStatus,
    default: CandidateStatus.Open,
  })
  status: CandidateStatus;

  @Column({ type: 'enum', enum: UserDepartment, nullable: true })
  department: UserDepartment;

  @Column({ type: 'enum', enum: HighetsLevelCandidate })
  highest_level: HighetsLevelCandidate;

  @Column({ default: '' })
  note: string;

  @Column('text', { nullable: true, array: true })
  skills: string[];

  @OneToMany(() => InterviewSchedule, (is) => is.job)
  interview_schedules: InterviewSchedule[];

  @OneToMany(() => Offer, (offer) => offer.candidate)
  offers: Offer[];
}
