import { BeforeInsert, Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { AbstractEntity } from '@/base/service/abstract-entity.service';
import { EState } from '@shared/enum/common.enum';
import { EGender, UserDepartment, UserRole } from '../user.constant';
import { removeAccents } from '@/base/helper/function.helper';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';
import { Candidate } from '@/candidate/entities/candidate.entity';
import { Offer } from '@/offer/entities/offer.entity';

@Entity()
export class User extends AbstractEntity {
  @Column()
  username: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  dob: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: '' })
  note: string;

  @Column({ default: '' })
  full_name: string;

  @Column({ type: 'enum', enum: EGender, default: EGender.Other })
  gender: EGender;

  @Column({ type: 'enum', enum: EState, default: EState.Active })
  status: EState;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Interviewer })
  role: UserRole;

  @Column({ default: '' })
  address: string;

  @Column({ type: 'enum', enum: UserDepartment, nullable: true })
  department: UserDepartment;

  @ManyToMany(() => InterviewSchedule, (is) => is.interviewers)
  interview_schedules: InterviewSchedule[];

  @OneToMany(() => Offer, (offer) => offer.manager)
  offers: Offer[];

  setPassword(password: string) {
    this.password = bcrypt.hashSync(password, 10);
  }

  comparePassword(rawPassword: string): boolean {
    const userPassword = this.password;
    return bcrypt.compareSync(rawPassword, userPassword);
  }

  private async checkUsernameExists(username: string): Promise<boolean> {
    const existingUser = await User.findOneBy({ username });
    return !!existingUser;
  }

  @BeforeInsert()
  async generateUniqueUsername() {
    // const nameParts = removeAccents(this.full_name).toLowerCase().split(' ');
    // const baseUsername = nameParts[0] + nameParts[nameParts.length - 1];
    // let username = baseUsername;
    // let counter = 1;

    // while (await this.checkUsernameExists(username)) {
    //   username = `${baseUsername}${counter}`;
    //   counter++;
    // }

    // this.username = username;
    this.setPassword('123456');
  }
}
