import { IsEnum, IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContributionStatus } from '../../types/contribution.enum';

export class UpdateContributionStatusDto {
  @ApiProperty({
    enum: ContributionStatus,
    example: ContributionStatus.Approved,
    description: 'The new status of the contribution',
  })
  @IsEnum(ContributionStatus)
  @IsNotEmpty()
  status: ContributionStatus;

  @ApiProperty({
    example: 100,
    description: 'The points awarded for the contribution',
  })
  @IsNumber()
  @IsNotEmpty()
  points: number;

  @IsString()
  @IsOptional()
  reviewed_by?: string;
}