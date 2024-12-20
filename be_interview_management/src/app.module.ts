import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// BASE
import { LoggerModule } from '@base/logger/logger.module';
import { dbConfig } from '@base/db/db.config';
import { MailerModule } from '@base/mailer/mailer.module';

// APPS
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { RoleModule } from '@/role/role.module';

// SHARED
import { SeedersModule } from '@shared/seeder/seeder.module';

import { CacheModule } from '@nestjs/cache-manager';
import { UploadFileModule } from './base/multer/upload-file.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JobModule } from './job/job.module';
import { CandidateModule } from './candidate/candidate.module';
import { InterviewScheduleModule } from './interview_schedule/interview_schedule.module';
import { OfferModule } from './offer/offer.module';
import { RequestModule } from './request/request.module';
import { StatiticModule } from './statitic/statitic.module';

const appModule = [AuthModule, UserModule, RoleModule, MailerModule];
const baseModule = [LoggerModule, UploadFileModule];

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot(dbConfig),
    EventEmitterModule.forRoot(),
    ...baseModule,
    ...appModule,
    SeedersModule,
    JobModule,
    CandidateModule,
    InterviewScheduleModule,
    OfferModule,
    StatiticModule,
    RequestModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
