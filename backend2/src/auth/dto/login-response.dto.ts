import { User } from '../../users/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Defines the data structure for a successful login response.
 * It includes a unique session token and the user's details.
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'The unique session token for the authenticated user.',
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
  })
  session_token: string;

  @ApiProperty({
    description: 'Details of the authenticated user.',
    type: User,
  })
  user: User;
}
