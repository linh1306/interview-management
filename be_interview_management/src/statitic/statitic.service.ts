import { Injectable } from '@nestjs/common';
import { CreateStatiticDto } from './dto/create-statitic.dto';
import { UpdateStatiticDto } from './dto/update-statitic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Candidate } from '@/candidate/entities/candidate.entity';
import { Job } from '@/job/entities/job.entity';
import { InterviewSchedule } from '@/interview_schedule/entities/interview_schedule.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
import { InterviewStatus } from '@/interview_schedule/interview_schedule.constant';
import { BaseService } from '@/base/service/base.service';
import { PaginateConfig } from '@/base/service/paginate/paginate';
import { ListDto } from '@/shared/dtos/common.dto';
import { CandidateStatus } from '@/candidate/candidate.constant';

@Injectable()
export class StatiticService extends BaseService<Candidate> {
  constructor(
    @InjectRepository(Candidate)
    protected candidateRepository: Repository<Candidate>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
    @InjectRepository(InterviewSchedule)
    private isRepository: Repository<InterviewSchedule>,
  ) {
    super(candidateRepository);
  }

  async dashboard() {
    return Promise.all([
      this.candidateRepository.count(),
      this.jobRepository.count(),
      this.jobRepository
        .createQueryBuilder('job')
        .leftJoinAndSelect('job.interview_schedules', 'is')
        .where(`is.id is not null`)
        .getCount(),
      this.isRepository.count({
        where: {
          status: InterviewStatus.Invited,
        },
      }),
    ]);
  }

  async jobStatitics(year: number) {
    const resp = await this.jobRepository.query(
      `WITH months AS (
    SELECT generate_series(1, 12) AS month_number
),
job_monthly_status AS (
    SELECT 
        EXTRACT(MONTH FROM j.created_date) AS month_number,
        COUNT(CASE WHEN isch.id is not NULL THEN 1 END) AS applied_count,
        COUNT(CASE WHEN isch.id IS NULL THEN 1 END) AS not_applied_count
    FROM 
        job j
    LEFT JOIN 
        interview_schedule isch 
    ON 
        j.id = isch.job_id
        
--    left join candidate c on isch.candidate_id = c.id
    WHERE 
        EXTRACT(YEAR FROM j.created_date) = $1
    GROUP BY 
        EXTRACT(MONTH FROM j.created_date)
)
SELECT 
    m.month_number,
    COALESCE(jms.applied_count, 0) AS applied_count,
    COALESCE(jms.not_applied_count, 0) AS not_applied_count
FROM 
    months m
LEFT JOIN 
    job_monthly_status jms
ON 
    m.month_number = jms.month_number
ORDER BY 
    m.month_number
`,
      [year],
    );

    return resp.map((v) => ({
      name: this.getMonthName(Number(v.month_number)),
      val: Number(v.applied_count),
      value: Number(v.not_applied_count),
    }));
    // return {
    //   name: this.getMonthName(Number(month)),
    //   val: Number(apply),
    //   value: Number(not_apply),
    // };
  }

  async candidateStatus(query: ListDto) {
    const config: PaginateConfig<Candidate> = {
      sortableColumns: ['created_date', 'last_modified_date'],
      defaultSortBy: [['last_modified_date', 'DESC']],
    };

    return this.listWithPage(query, config);
  }

  async candidateDistribution() {
    const resp = await this.candidateRepository
      .query(`select status , count(id) from candidate c 
group by c.status `);

    return Object.values(CandidateStatus).map((v) => {
      const a = resp.find((t) => t.status == v);

      if (a)
        return {
          status: v,
          value: Number(a.count),
        };

      return {
        status: v,
        value: 0,
      };
    });
  }

  private getMonthName(month: number) {
    const d = new Date();
    d.setMonth(month - 1);
    const monthName = d.toLocaleString('default', { month: 'long' });
    return monthName;
  }
}
