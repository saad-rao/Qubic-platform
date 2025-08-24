import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('revoke')
  @HttpCode(HttpStatus.OK)
  async revokeSession(@Body('session_token') sessionToken: string) {
    if (!sessionToken) {
      throw new UnauthorizedException('Session token is required.');
    }
    const success = await this.sessionsService.deleteOneByToken(sessionToken);
    if (!success) {
      throw new UnauthorizedException('Invalid or expired session token.');
    }
    return { message: 'Session successfully revoked.' };
  }
}
