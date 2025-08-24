import { IsString, IsNotEmpty, IsUrl, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ContributionType } from '../../types/contribution.enum';

export class CreateContributionDto {
  @ApiProperty({
    enum: ContributionType,
    example: ContributionType.Twitter,
    description: 'The type of contribution',
  })
  @IsEnum(ContributionType)
  @IsNotEmpty()
  type: ContributionType;

  @ApiProperty({
    example: 'https://twitter.com/post/123456789',
    description: 'The URL of the contribution',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'A post about the latest project update.',
    description: 'A brief description of the contribution (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}