import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../users/schemas/user.schema';
import { IsEmail, IsNotEmpty, isString, IsString } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'johndoe@example.com', description: 'The email for login' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'The password for login' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'Visitor', description: 'The role for the user' })
    @IsString()
    @IsNotEmpty()
    role: string;

}