import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Contribution, ContributionDocument } from './schemas/contribution.schema';
import { UpdateContributionStatusDto } from './dto/update-contribution-status.dto';

@Injectable()
export class ContributionsService {
  constructor(@InjectModel(Contribution.name) private contributionModel: Model<ContributionDocument>) {}

  /**
   * Creates a new contribution.
   * @param createContributionDto - The DTO for creating a contribution.
   * @returns The newly created contribution.
   */
  async create(user_id: string, createContributionDto: any): Promise<Contribution> {
    const createdContribution = new this.contributionModel({ ...createContributionDto, user_id });
    return createdContribution.save();
  }

  /**
   * Finds a contribution by its ID.
   * @param id - The ID of the contribution.
   * @returns The found contribution.
   * @throws {NotFoundException} if the contribution is not found.
   */
  async findOne(id: string): Promise<Contribution> {
    const contribution = await this.contributionModel.findById(id).exec();
    if (!contribution) {
      throw new NotFoundException(`Contribution with ID "${id}" not found.`);
    }
    return contribution;
  }

  /**
   * Finds all contributions with a 'pending' status.
   * @returns An array of pending contributions.
   */
  async findAllPending(): Promise<Contribution[]> {
    return this.contributionModel.find({ status: 'pending' }).exec();
  }

  /**
   * Updates the status of a contribution.
   * @param id - The ID of the contribution to update.
   * @param updateContributionStatusDto - The DTO with the new status and points.
   * @param reviewed_by - The ID of the user who reviewed the contribution.
   * @returns The updated contribution.
   * @throws {NotFoundException} if the contribution is not found.
   */
  async updateContributionStatus(
    id: string,
    updateContributionStatusDto: UpdateContributionStatusDto,
    reviewed_by: string, // Corrected type hint
  ): Promise<Contribution> {
    const { status, points } = updateContributionStatusDto;
    const contribution = await this.contributionModel.findById(id).exec();

    if (!contribution) {
      throw new NotFoundException(`Contribution with ID "${id}" not found.`);
    }

    contribution.status = status;
    contribution.points = points;
    contribution.reviewed_by = reviewed_by;
    contribution.reviewed_at = new Date();

    return contribution.save();
  }

    /**
   * Finds all contributions by a specific user ID.
   * @param userId - The ID of the user.
   * @returns An array of contributions associated with the user.
   */
  async findAllByUser(userId: string): Promise<Contribution[]> {
    return this.contributionModel.find({ user_id: userId }).exec();
  }
}
