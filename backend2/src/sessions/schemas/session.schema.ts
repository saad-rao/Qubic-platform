import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * The Session document for session management.
 * It stores session tokens and expiration times for authenticated users.
 */
@Schema({ timestamps: true })
export class Session {
  /**
   * The unique identifier for the session.
   */
  _id: Types.ObjectId;

  /**
   * The ID of the user associated with this session.
   * This acts as a foreign key to the `User` document.
   */
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  /**
   * A unique, cryptographically secure token used to identify the session.
   */
  @Prop({ required: true, unique: true })
  session_token: string;

  /**
   * The timestamp when this session will expire.
   */
  @Prop({ required: true })
  expires_at: Date;

  /**
   * The timestamp when this session was created.
   * Managed automatically by Mongoose timestamps.
   */
  created_at: Date;
}

export type SessionDocument = Session & Document;

export const SessionSchema = SchemaFactory.createForClass(Session);

