import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { SessionsService } from 'src/sessions/sessions.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Model, Types } from 'mongoose';
import { RegisterDto } from './dto/register-user.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

   /**
   * Validates a session token and returns the associated user.
   * @param sessionToken The session token to validate.
   * @returns The user document associated with the session.
   * @throws {UnauthorizedException} if the session is invalid or expired.
   */
  async validateSession(sessionToken: string): Promise<User> {
    const session = await this.sessionsService.findOneByToken(sessionToken);

    if (!session || session.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid or expired session.');
    }

    const user = await this.usersService.findById(session.user_id.toHexString());
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    return user;
  }

  /**
   * Revokes an existing session, effectively logging the user out.
   * @param sessionToken The session token to revoke.
   * @returns A boolean indicating if the session was successfully deleted.
   */
  async logout(sessionToken: string): Promise<boolean> {
    return this.sessionsService.deleteOneByToken(sessionToken);
  }


  // async login(user: UserDocument) {
  //   const { password_hash, ...result } = user.toObject();
  //   const payload = { email: result.email, sub: result._id, role: result.role };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  /**
   * Validates a user's credentials and creates a new session.
   * @param loginDto The login DTO containing email and password.
   * @returns A DTO with the session token and user details.
   */
  async login(loginDto: LoginUserDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password_hash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate a secure session token
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days

    // Create and save the new session
    await this.sessionsService.create(new Types.ObjectId(user.id).toHexString(), sessionToken, expiresAt);

    // Return the session token and user details
    return {
      session_token: sessionToken,
      user,
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, role } = registerDto;

    if(!role) throw new HttpException('User role is required to register', HttpStatus.BAD_REQUEST);
    
    // Check if user with this email already exists
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new HttpException(
        'User with this email already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

     // Generate a simple verification token. In a real app, this should be a cryptographically secure token.
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);


    // Create and save the new user
    const newUser = new this.userModel({
      email,
      password_hash: hashedPassword,
      verification_token: verificationToken, // Store the verification token
    });
    
    const savedUser = await newUser.save();

    // Once the user is saved, send the verification email.
    // await this.mailService.sendVerificationEmail(savedUser.email, verificationToken);
    
    const userObject = savedUser.toObject();
    delete userObject.password_hash;
    
    return userObject as User;

    // // Create and save the new user
    // return this.usersService.create({email, password_hash: hashedPassword, role });
  }

   async verifyEmail(token: string): Promise<void> {
    // Find a user with the provided verification token
    const user = await this.userModel.findOne({ verification_token: token });

    if (!user) {
      throw new HttpException('Invalid or expired token.', HttpStatus.BAD_REQUEST);
    }
    
    // Check if the user is already verified
    if (user.email_verified) {
      throw new HttpException('Email is already verified.', HttpStatus.CONFLICT);
    }

    // Update the user's status
    user.email_verified = true;
    user.verification_token = null; // Clear the token after use
    await user.save();
  }
  
}
