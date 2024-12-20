import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '@/base/service/base.service';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ListDto } from '@/shared/dtos/common.dto';
import { User } from '@/user/entities/user.entity';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { RequestStatus, RequestLevel } from './request.constant';
import { UserRole } from '@/user/user.constant';
import { BadRequest } from '@/base/api/exception.reslover';

@Injectable()
export class RequestService extends BaseService<Request> {
  constructor(
    @InjectRepository(Request)
    protected repository: Repository<Request>,
  ) {
    super(repository);
  }

  async create(payload: CreateRequestDto, user: User) {
    return this.repository.save({
      ...payload,
      created_by: user,
    });
  }

  findAll(query: ListDto, user: User) {
    const config: PaginateConfig<Request> = {
        sortableColumns: ['created_date'],
        defaultSortBy: [['created_date', 'DESC']],
        searchableColumns: ['position', 'department', 'workplace'],
        relations: ['created_by'],
    };

    // Nếu user không phải Admin hoặc HR thì chỉ xem được request của phòng ban mình
    if (![UserRole.Admin, UserRole.HR].includes(user.role)) {
        config.where = {
            department: user.department
        };
    }

    return this.listWithPage(query, config);
}


  findOne(id: number) {
    return this.repository.findOne({
      where: { id },
      relations: ['created_by']
    });
  }

  async update(id: number, payload: UpdateRequestDto, user: User) {
    const request = await this.repository.findOne({ where: { id } });
    return this.repository.save({
      ...request,
      ...payload,
      last_modified_by: user,
    });
  }

  async updateStatus(id: number, status: RequestStatus, user: User) {
  const request = await this.repository.findOne({
    where: { id },
    relations: ['created_by']
  });

  if (!request) {
    throw new BadRequest({ message: 'Request not found' });
  }

  // Chỉ Admin hoặc HR mới có thể approve/reject
  if ([RequestStatus.Approved, RequestStatus.Rejected].includes(status)
      && ![UserRole.Admin, UserRole.HR].includes(user.role)) {
    throw new BadRequest({ message: 'You do not have permission to approve/reject requests' });
  }

  return this.repository.save({
    ...request,
    status,
    last_modified_by: user,
  });
}

  remove(id: number) {
    return this.repository.update(id, { deleted: new Date() });
  }
}