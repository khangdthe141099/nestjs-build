import { Module, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          //Pre-save actions:
          schema.pre('save', async function (next) {
            const user: any = this;
            const hasPasswordField = user.isModified('password');
            if (!hasPasswordField) return next();
            const saltOrRounds = 10;
            user.password = await bcrypt.hash(user.password, saltOrRounds);
            next();
          });
          return schema;
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
