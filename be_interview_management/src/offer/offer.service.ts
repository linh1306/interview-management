import { Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { BaseService } from '@/base/service/base.service';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '@/candidate/entities/candidate.entity';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';
import { User } from '@/user/entities/user.entity';
import { ListDto } from '@/shared/dtos/common.dto';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { OfferStatus } from './offer.constant';
import { UserRole } from '@/user/user.constant';

@Injectable()
export class OfferService extends BaseService<Offer> {
  constructor(
    @InjectRepository(Offer)
    protected repository: Repository<Offer>,
  ) {
    super(repository);
  }

  create(payload: CreateOfferDto, user: User) {
    const {
      manager_id,
      interview_schedule_id,
      candidate_id,
      // due_date,
      contract_from,
      contract_to,
        status,
      ...rest
    } = payload;

    return this.repository.save({
      department: [UserRole.Admin, UserRole.HR].includes(user.role)
        ? payload.department
        : user.department,
      ...rest,
      // due_date: new Date(due_date),
      contract_from: new Date(contract_from),
      contract_to: new Date(contract_to),
      status: payload.status,
      candidate: { id: candidate_id } as Candidate,
      interview_schedule: {
        id: interview_schedule_id,
      } as InterviewSchedule,
      // recruiter: { id: payload.recruiter_id } as User,
      manager: { id: manager_id } as User,

    });
  }

  findAll(query: ListDto, user: User) {
    const config: PaginateConfig<Offer> = {
      sortableColumns: ['last_modified_date'],
      defaultSortBy: [['last_modified_date', 'DESC']],
      relations: {
        candidate: true,
        manager: true,
        interview_schedule: true,
      },
      searchableColumns: ['candidate.full_name'],
    };

    if ([UserRole.Interviewer, UserRole.Manager].includes(user.role))
      config.where = {
        department: user.department,
      };
    return this.listWithPage(query, config);
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, payload: UpdateOfferDto) {
    const {
      manager_id,
      interview_schedule_id,
      candidate_id,
      // due_date,
      contract_from,
      contract_to,
      contract_type,
      ...rest
    } = payload;
    return this.repository.update(id, {
      ...rest,
      // due_date: new Date(due_date),
      contract_from: new Date(contract_from),
      contract_to: new Date(contract_to),
      candidate: { id: candidate_id } as Candidate,
      interview_schedule: {
        id: interview_schedule_id,
      } as InterviewSchedule,
      // recruiter: { id: payload.recruiter_id } as User,
      manager: { id: manager_id } as User,
    });
  }

  remove(id: number) {
    return this.repository.update(id, { deleted: new Date() });
  }
}
