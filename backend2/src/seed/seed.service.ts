import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ContributionsService } from '../contributions/contributions.service';
import { Role } from '../types/roles.enum';
import { ContributionStatus, ContributionType } from '../types/contribution.enum';
import { Types } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly contributionsService: ContributionsService,
  ) {}

  async onModuleInit() {
    // Only run seeding in development mode
    if (process.env.NODE_ENV === 'development') {
      this.logger.log('Starting database seeding...');
      const adminUser = await this.seedAdminUser();
      const ambassadorUser = await this.seedAmbassadorUser();
      const visitorUser = await this.seedVisitorUser();
      
      // The parameter for userIds is now correctly an array of strings
      // console.log({adminUser, id: adminUser.id});
      await this.seedContributions(new Types.ObjectId(adminUser.id).toHexString(), [new Types.ObjectId(ambassadorUser.id).toHexString(), new Types.ObjectId(visitorUser.id).toHexString()]);
      
      this.logger.log('Database seeding completed.');
    }
  }

  /**
   * Seeds an admin user if one does not already exist.
   * @returns The seeded admin user document.
   */
  private async seedAdminUser() {
    const email = 'admin@example.com';
    let user = (await this.usersService.findOneByEmail(email)).toObject();
    if (!user) {
      this.logger.log('Seeding admin user...');
      user = await this.usersService.create({
        email,
        password_hash: 'adminpassword',
        role: Role.Admin,
      });
      this.logger.log('Admin user seeded successfully.');
    } else {
      this.logger.log('Admin user already exists. Skipping seed.');
    }
    return user;
  }

  /**
   * Seeds an ambassador user for testing.
   * @returns The seeded ambassador user document.
   */
  private async seedAmbassadorUser() {
    const email = 'ambassador@example.com';
    let user = (await this.usersService.findOneByEmail(email)).toObject();
    if (!user) {
      this.logger.log('Seeding ambassador user...');
      user = await this.usersService.create({
        email,
        password_hash: 'ambassadorpassword',
        role: Role.Ambassador,
      });
      this.logger.log('Ambassador user seeded successfully.');
    } else {
      this.logger.log('Ambassador user already exists. Skipping seed.');
    }
    return user;
  }

  /**
   * Seeds a regular visitor user for testing.
   * @returns The seeded visitor user document.
   */
  private async seedVisitorUser() {
    const email = 'visitor@example.com';
    let user: UserDocument | User = await this.usersService.findOneByEmail(email);
    if (!user) {
      this.logger.log('Seeding visitor user...');
      user = await this.usersService.create({
        email,
        password_hash: 'visitorpassword',
        role: Role.Visitor,
      });
      this.logger.log('Visitor user seeded successfully.');
    } else {
      this.logger.log('Visitor user already exists. Skipping seed.');
    }
    return user;
  }

  /**
   * Seeds mock contributions with different statuses.
   * @param adminId The ObjectId of the admin user who will review contributions.
   * @param userIds An array of ObjectIds of users to associate with the contributions.
   */
  private async seedContributions(adminId: string, userIds: string[]) {
    // Check if contributions already exist to avoid duplication
    const existingContributions = await this.contributionsService.findAllPending();
    if (existingContributions.length > 0) {
      this.logger.log('Contributions already exist. Skipping seed.');
      return;
    }

    this.logger.log('Seeding contributions...');

    const contributionsToSeed = [
      // Pending contributions
      {
        user_id: userIds[0],
        type: ContributionType.Twitter,
        url: 'https://twitter.com/qubic/status/17234567890',
        description: 'A new twitter post about the project.',
        status: ContributionStatus.Pending,
      },
      {
        user_id: userIds[1],
        type: ContributionType.Github,
        url: 'https://github.com/qubic-project/main-repo/pull/10',
        description: 'A pull request with a new feature.',
        status: ContributionStatus.Pending,
      },
      // Approved contributions
      {
        user_id: userIds[0],
        type: ContributionType.Medium,
        url: 'https://medium.com/qubic/article-on-ambassador-program',
        description: 'An article explaining the ambassador program.',
        status: ContributionStatus.Approved,
        points: 500,
        reviewed_by: adminId,
        reviewed_at: new Date(),
      },
      // Rejected contributions
      {
        user_id: userIds[1],
        type: ContributionType.Youtube,
        url: 'https://youtube.com/watch?v=12345abc',
        description: 'A video explaining Qubic.',
        status: ContributionStatus.Rejected,
        points: 0,
        reviewed_by: adminId,
        reviewed_at: new Date(),
      },
    ];

    for (const contributionData of contributionsToSeed) {
      await this.contributionsService.create(contributionData.user_id, contributionData);
    }
    
    this.logger.log('Contributions seeded successfully.');
  }
}
