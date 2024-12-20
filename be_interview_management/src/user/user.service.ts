import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';

// BASE
import * as exc from '@/base/api/exception.reslover';
import { LoggerService } from '@base/logger';
import { BaseService } from '@/base/service/base.service';

// APPS
import { User } from '@/user/entities/user.entity';
import { PaginateConfig } from '@base/service/paginate/paginate';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ListUserDto } from './dtos/list-user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    private readonly loggerService: LoggerService,
  ) {
    super(repository);
  }

  logger = this.loggerService.getLogger(UserService.name);

  async findOne(username: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { username: username } });
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.repository.findOne({ where: { id: id } });
  }

  async list(query: ListUserDto) {
    const config: PaginateConfig<User> = {
      searchableColumns: ['username', 'email', 'phone', 'full_name'],
      sortableColumns: ['last_modified_date'],
      where: { id: Not(1) },
    };

    return this.listWithPage(query, config);
  }

  async create(payload: CreateUserDto, user: User) {
    const userTemp: User = this.repository.create(payload);
    userTemp.created_by = user;
    userTemp.dob = new Date(payload.dob);
    return userTemp.save();
  }

  async update(id: number, payload: UpdateUserDto, user: User) {
    const userFind = await this.repository.findOneBy({ id });
    return this.repository.save({
      id: userFind.id,
      ...payload,
      dob: new Date(payload.dob),
      last_modified_by: user,
    });
  }

  async findByEmail(email: string) {
    const user = await this.repository.findOne({
      where: { email },
    });

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.repository.findOne({
      where: { username },
    });

    return user;
  }
}
