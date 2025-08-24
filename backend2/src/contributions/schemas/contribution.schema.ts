import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ContributionType, ContributionStatus } from '../../types/contribution.enum';
import { User } from '../../users/schemas/user.schema';

export type ContributionDocument = Contribution & Document;

@Schema()
export class Contribution {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ContributionType, required: true })
  type: ContributionType;

  @Prop({ required: true })
  url: string;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  points: number;

  @Prop({ type: String, enum: ContributionStatus, default: ContributionStatus.Pending })
  status: ContributionStatus;

  @Prop({ type: MongooseSchema.Types.String, ref: 'User' })
  reviewed_by?: string;

  @Prop()
  reviewed_at?: Date;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ContributionSchema = SchemaFactory.createForClass(Contribution);

// Update updated_at timestamp on save
ContributionSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});