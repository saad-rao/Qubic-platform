import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, isNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'johndoe@example.com', description: 'The email of the user', uniqueItems: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password_hash: string;

  @ApiProperty({ example: 'Visitor', description: 'The role of the user', required: true })
  @IsString()
  @IsNotEmpty()
  role?: string;
}