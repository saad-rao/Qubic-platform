import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsersModule } from '../users/users.module';
import { ContributionsModule } from 'src/contributions/contributions.module';

@Module({
  imports: [UsersModule, ContributionsModule],
  providers: [SeedService],
})
export class SeedModule {}