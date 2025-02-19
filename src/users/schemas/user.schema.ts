import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  email: string;

  @Prop({ required: true, type: String })
  password: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: String })
  address: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
