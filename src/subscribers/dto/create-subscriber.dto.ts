import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email wrong format' })
  email: string;

  @IsNotEmpty({ message: 'Skills is required' })
  @IsArray({ message: 'Skills format is array' })
  @IsString({ each: true, message: 'Skills format is string' })
  skills: string[];
}
