import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '../../types/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop()
  id?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop()
  username?: string;

  @Prop({ type: String, enum: Role, default: Role.Visitor })
  role: Role;

  @Prop({ default: 0 })
  total_points: number;

  @Prop({ default: 0 })
  total_contributions: number;

  @Prop({ default: 0 })
  rank: number;

  @Prop({ default: false })
  is_approved: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  last_activity: Date;

  @Prop({ default: false })
  email_verified: boolean;

  @Prop()
  verification_token?: string;

  @Prop()
  reset_password_token?: string;

  @Prop()
  reset_password_expires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Pre-save hook to hash the password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password_hash')) {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }
  next();
});