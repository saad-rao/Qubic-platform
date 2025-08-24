import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
  ) {}

  /**
   * Creates a new session for a user.
   * @param userId The ID of the user.
   * @param sessionToken A unique token for the session.
   * @param expiresAt The expiration date of the session.
   * @returns The created session document.
   */
  async create(userId: string, sessionToken: string, expiresAt: Date): Promise<Session> {
    const newSession = new this.sessionModel({
      user_id: new Types.ObjectId(userId),
      session_token: sessionToken,
      expires_at: expiresAt,
    });
    return newSession.save();
  }

  /**
   * Finds a session by its unique token.
   * @param sessionToken The unique session token.
   * @returns The session document or null if not found.
   */
  async findOneByToken(sessionToken: string): Promise<Session | null> {
    return this.sessionModel.findOne({ session_token: sessionToken }).exec();
  }

  /**
   * Deletes a session by its unique token.
   * @param sessionToken The unique session token.
   * @returns A boolean indicating if the deletion was successful.
   */
  async deleteOneByToken(sessionToken: string): Promise<boolean> {
    const result = await this.sessionModel.deleteOne({ session_token: sessionToken }).exec();
    return result.deletedCount > 0;
  }
}
