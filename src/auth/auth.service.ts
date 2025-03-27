import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async generateTokens(userId: string) {
    const payload = { sub: userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(userId: string) {
    const { access_token } = await this.generateTokens(userId);
    return {
      id: userId,
      access_token,
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user: any = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not register!');

    const comparePassword = pass === user.password;
    if (!comparePassword) throw new UnauthorizedException('Password not match');

    const { password, ...result } = user;

    return result;
  }

  async validateJwtUser(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found!');
    return user;
  }
}
