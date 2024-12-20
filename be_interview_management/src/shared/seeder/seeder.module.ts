import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { SeederService } from '@shared/seeder/seeder.service';
import { UserSeed } from '@shared/seeder/user.seed';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [SeederService, UserSeed],
})
export class SeedersModule {}
