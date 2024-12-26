import { Injectable } from '@nestjs/common';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { BaseService } from '@/base/service/base.service';
import { Candidate } from './entities/candidate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListDto } from '@/shared/dtos/common.dto';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { User } from '@/user/entities/user.entity';
import { UserRole } from '@/user/user.constant';
import { BadRequest } from '@/base/api/exception.reslover';
import { CandidateStatus } from './candidate.constant';

@Injectable()
export class CandidateService extends BaseService<Candidate> {
  constructor(
    @InjectRepository(Candidate) protected repository: Repository<Candidate>,
  ) {
    super(repository);
  }

  async create(payload: CreateCandidateDto, user: User) {
    const existingEmail = await this.repository.findOne({
      where: {
        email: payload.email,
        deleted: null // Chỉ check với các record chưa bị xóa
      }
    });
    if (existingEmail) {
      throw new BadRequest({
        message: 'Email already exists',
      });
    }

    // Kiểm tra phone đã tồn tại
    const existingPhone = await this.repository.findOne({
      where: {
        phone: payload.phone,
        deleted: null
      }
    });
    if (existingPhone) {
      throw new BadRequest({
        message: 'Phone number already exists',
      });
    }

    return this.repository.save({
      ...payload,
      attach_file: payload.file,
      created_by: user,
      department: [UserRole.Admin, UserRole.HR].includes(user.role)
        ? payload.department
        : user.department,
      skills:
        typeof payload.skills == 'string' ? [payload.skills] : payload.skills,
    });
  }

  findAll(query: ListDto, user: User) {
    const config: PaginateConfig<Candidate> = {
      sortableColumns: ['last_modified_date'],
      searchableColumns: ['full_name', 'email', 'phone'],
    };

    if ([UserRole.Manager, UserRole.Interviewer].includes(user.role))
      config.where = {
        department: user.department,
      };
    return this.listWithPage(query, config);
  }

  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(id: number, payload: UpdateCandidateDto, user: User) {
    const candidate = await this.repository.findOne({
      where: { id },
    });

    const attach_file = payload.file ? payload.file : candidate.attach_file;
    delete payload.file;
    return this.repository.update(id, {
      ...payload,
      attach_file,
      last_modified_by: user,
      department: [UserRole.Admin, UserRole.HR].includes(user.role)
        ? payload.department
        : user.department,
      skills:
        typeof payload.skills == 'string' ? [payload.skills] : payload.skills,
    });
  }

  async remove(id: number) {
    const candidate = await this.repository.findOne({
      where: { id },
    });

    // if (candidate.status !== CandidateStatus.Open)
    //   throw new BadRequest({ message: 'cannot remove this candidate' });
    return this.repository.update(id, { deleted: new Date() });
  }
}
