import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    // If no token is provided, the request is unauthorized
    if (!token) {
      throw new UnauthorizedException('Authentication token not found.');
    }

    try {
      // Validate the session token and get the user
      const user = await this.authService.validateSession(token);
      
      // If the user is null, the session is invalid
      if (!user) {
        throw new UnauthorizedException('Invalid or expired token.');
      }
      
      // Attach the user to the request object for future use in controllers
      request.user = user;
      
      // Allow the request to proceed
      return true;
    } catch (error) {
      // Catch any exceptions thrown by validateSession or above
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
