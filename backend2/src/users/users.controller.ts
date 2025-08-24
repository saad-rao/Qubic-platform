import { Controller, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../types/roles.enum';
import { SessionGuard } from 'src/auth/sessions.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get current user profile (protected)' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @UseGuards(SessionGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'Admin-only route' })
  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @UseGuards(SessionGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get('admin-area')
  getAdminArea(@Request() req) {
    return { message: 'Welcome, Admin!', user: req.user };
  }
}