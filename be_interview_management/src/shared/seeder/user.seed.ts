import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EState } from '@shared/enum/common.enum';
import { User } from '@/user/entities/user.entity';
import { UserRole } from '@/user/user.constant';

const data: Array<Partial<User>> = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    password: '$2b$10$VU9fAWrF61xLIUkJKf5vBuBCh4RzdCFNekqLppKhk01/WwTx3BBFK',
    status: EState.Active,
    role: UserRole.Admin,
    full_name: 'Admin',
  },
];

const dataSkill = [
  {
    name: 'C/C++',
  },
  {
    name: 'Java',
  },
  {
    name: 'Python',
  },
  {
    name: 'Javascript',
  },
  {
    name: '.Net',
  },
  {
    name: 'Angular',
  },
  {
    name: 'NodeJs',
  },
  {
    name: 'Business Alalyst',
  },
  {
    name: 'Software Testing',
  },
  {
    name: 'VueJs',
  },
];

@Injectable()
export class UserSeed {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
  ) {}

  async seed() {
    const count = await Promise.all([this.repository.count()]);
    if (!count[0]) {
      for (const user of data) {
        await this.repository.save({
          ...user,
        });
      }
    }
  }
}
