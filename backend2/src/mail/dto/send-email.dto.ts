import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty({ example: 'testuser@example.com', description: 'The recipient of the email' })
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ example: 'Welcome!', description: 'The subject of the email' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: '<h1>Hello there!</h1>', description: 'The HTML body of the email' })
  @IsString()
  @IsNotEmpty()
  body: string;
}