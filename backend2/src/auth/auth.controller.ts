import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/schemas/user.schema';
import { RegisterDto } from './dto/register-user.dto';
import { SessionGuard } from 'src/auth/sessions.guard';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User successfully logged out.' })
  @ApiBearerAuth()
  async logout(@Request() req: any) {
    // Assuming the session token is passed in the Authorization header
    const token = req.headers.authorization?.replace('Bearer ', '');
    await this.authService.logout(token);
    return { message: 'Successfully logged out.' };
  }

  @Post('profile')
  @ApiOkResponse({ description: 'Returns the authenticated user profile.', type: User })
  @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  @UseGuards(SessionGuard)
  getProfile(@Request() req: any): User {
    // The user object is attached to the request by the JWT guard
    return req.user;
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'User successfully registered.',
    type: User,
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Email successfully verified.',
  })
  @ApiBody({ type: VerifyEmailDto })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    await this.authService.verifyEmail(verifyEmailDto.token);
    return { message: 'Email successfully verified.' };
  }
}
