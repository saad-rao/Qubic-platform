import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch } from '@nestjs/common';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateContributionStatusDto } from './dto/update-contribution-status.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../types/roles.enum';
import { SessionGuard } from 'src/auth/sessions.guard';

@ApiTags('contributions')
@Controller('contributions')
// @UseGuards(JwtAuthGuard)
@UseGuards(SessionGuard)
@ApiBearerAuth()
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @ApiOperation({ summary: 'Submit a new contribution' })
  @Post()
  async create(@Request() req, @Body() createContributionDto: CreateContributionDto) {
    const userId = req.user.userId;
    return this.contributionsService.create(userId, createContributionDto);
  }

  @ApiOperation({ summary: 'Get all contributions for the current user' })
  @Get()
  async findAllByUser(@Request() req) {
    const userId = req.user.userId;
    return this.contributionsService.findAllByUser(userId);
  }

  @ApiOperation({ summary: 'Get a single contribution by ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contributionsService.findOne(id);
  }
  
  @ApiOperation({ summary: 'Admin: Get all pending contributions' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('review/pending')
  async findAllPending() {
    return this.contributionsService.findAllPending();
  }

  @ApiOperation({ summary: 'Admin: Review and update a contribution' })
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id/review')
  async reviewContribution(@Param('id') id: string, @Request() req, @Body() updateContributionDto: UpdateContributionStatusDto) {
    const reviewedBy = req.user.userId;
    return this.contributionsService.updateContributionStatus(id,updateContributionDto , reviewedBy);
  }
}