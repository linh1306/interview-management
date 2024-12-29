import {Injectable} from '@nestjs/common';
import {CreateInterviewScheduleDto} from './dto/create-interview_schedule.dto';
import {UpdateInterviewScheduleDto} from './dto/update-interview_schedule.dto';
import {BaseService} from '@/base/service/base.service';
import {InterviewSchedule} from './entities/interview_schedule.entity';
import {IsNull, Not, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {ListDto} from '@/shared/dtos/common.dto';
import {PaginateConfig} from '@/base/service/paginate/paginate';
import {Candidate} from '@/candidate/entities/candidate.entity';
import {Job} from '@/job/entities/job.entity';
import {User} from '@/user/entities/user.entity';
import {UserRole} from '@/user/user.constant';
import {CandidateStatus} from '@/candidate/candidate.constant';

@Injectable()
export class InterviewScheduleService extends BaseService<InterviewSchedule> {
    constructor(
        @InjectRepository(InterviewSchedule)
        protected repository: Repository<InterviewSchedule>,
        @InjectRepository(Candidate)
        protected candidateRepository: Repository<Candidate>,
    ) {
        super(repository);
    }

    async create(payload: CreateInterviewScheduleDto, user: User) {
        await this.repository.save({
            ...payload,
            candidate: {id: payload.candidate_id} as Candidate,
            job: {id: payload.job_id} as Job,
            interviewers: payload.interviewer_ids.map((id) => ({id} as User)),
            created_by: user,
        });

        return this.candidateRepository.update(payload.candidate_id, {
            status: CandidateStatus.Waiting,
        });
    }

    async findAll(query: ListDto, user: User) {
    if ([UserRole.Interviewer, UserRole.Manager].includes(user.role)) {
        const [interviews, total] = await this.repository
            .createQueryBuilder('interview')
            .leftJoinAndSelect('interview.job', 'job')
            .leftJoinAndSelect('interview.interviewers', 'interviewers')
            .leftJoinAndSelect('interview.candidate', 'candidate')
            .where('job.department::text = :department::text', {department: user.department})
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('is.interview_schedule_id')
                    .from('interviewer_schedule', 'is')
                    .innerJoin('user', 'u', 'u.id = is.interview_id')
                    .where('u.department::text = :department::text', {department: user.department})
                    .getQuery();
                return 'interview.id IN ' + subQuery;
            })
            .getManyAndCount();

        return {
                results: interviews,
                metadata: {
                    itemsPerPage: query.limit || 10,
                    totalItems: total,
                    currentPage: query.page || 1,
                    totalPages: Math.ceil(total / (query.limit || 10)),
                    sortBy: [['last_modified_date', 'DESC']]
            }
        };
    }

    const config: PaginateConfig<InterviewSchedule> = {
        sortableColumns: ['last_modified_date'],
        defaultSortBy: [['last_modified_date', 'DESC']],
        relations: {job: true, interviewers: true, candidate: true},
        searchableColumns: [
            'candidate.full_name',
            'candidate.email',
            'job.title',
            'title',
        ],
    };

    return this.listWithPage(query, config);
}

    findOne(id: number) {
        return this.repository.findOne({where: {id}});
    }

    async update(id: number, payload: UpdateInterviewScheduleDto, user: User) {
        const interview = await this.repository.findOne({where: {id}});

        return this.repository.save({
            id: interview.id,
            ...payload,
            candidate: {id: payload.candidate_id} as Candidate,
            job: {id: payload.job_id} as Job,
            interviewers: payload.interviewer_ids.map((id) => ({id} as User)),
            last_modified_by: user,
        });
    }

    remove(id: number) {
        return this.repository.update(id, {deleted: new Date()});
    }
}
