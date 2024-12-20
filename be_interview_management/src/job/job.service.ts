import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { BaseService } from '@/base/service/base.service';
import { Job } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ListDto } from '@/shared/dtos/common.dto';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { User } from '@/user/entities/user.entity';
import { UserRole } from '@/user/user.constant';
import { BadRequest } from '@/base/api/exception.reslover';
import { JobStatus } from './job.constant';

@Injectable()
export class JobService extends BaseService<Job> {
  constructor(
    @InjectRepository(Job)
    protected repository: Repository<Job>,
  ) {
    super(repository);
  }
  async create(payload: CreateJobDto, user: User) {
    const department = [UserRole.HR, UserRole.Admin].includes(user.role)
      ? payload.department
      : user.department;
    const job = await this.repository.save({
      ...payload,
      department,
      created_by: user,
    });

    return job;
  }

  findAll(query: ListDto, user: User) {
    const config: PaginateConfig<Job> = {
      sortableColumns: ['last_modified_date'],
      searchableColumns: ['title'],
      relations: {
        created_by: true,
        last_modified_by: true,
      },
    };

    if ([UserRole.Interviewer, UserRole.Manager].includes(user.role))
      config.where = {
        department: user.department,
      };
    return this.listWithPage(query, config);
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: {
        created_by: true,
        last_modified_by: true,
      },
    });
  }

  async update(id: number, payload: UpdateJobDto, user: User) {
    const job = await this.repository.findOne({
      where: { id },
    });

    const department = [UserRole.HR, UserRole.Admin].includes(user.role)
      ? payload.department
      : user.department;

    return this.repository.save({
      ...job,
      ...payload,
      department,
      last_modified_by: user,
    });
  }

  async remove(ids: number[]) {
    for (const id of ids) {
      const job = await this.repository.findOne({
        where: { id },
        relations: { interview_schedules: true },
      });
      if (job.status != JobStatus.Open)
        throw new BadRequest({ message: 'cannot remove this job' });
      await this.repository.update(id, { deleted: new Date() });
    }
  }
}
