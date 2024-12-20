import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserSeed } from '@shared/seeder/user.seed';
import { PermissionSeed } from '@shared/seeder/permission.seed';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(private readonly userSeed: UserSeed) {}

  async onModuleInit() {
    console.info('loading seed ...');
    await this.userSeed.seed();
    console.info('done!!!!');
  }
}
