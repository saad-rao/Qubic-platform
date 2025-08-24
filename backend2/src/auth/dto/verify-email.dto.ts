import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'The verification token received via email.',
    example: 'some-long-verification-token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
