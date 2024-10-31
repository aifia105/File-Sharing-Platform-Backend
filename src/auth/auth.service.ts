import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(User: User): Promise<{ access_token: string; user: User }> {
    try {
      const user = await this.validateUser(User.email, User.password);
      if (!user) {
        throw new UnauthorizedException();
      }
      const payload = { email: user.email, sub: user._id };

      const token = await this.jwtService.signAsync(payload, {
        expiresIn: Number(process.env.JWT_EXPIRATION),
        secret: process.env.JWT_SECRET,
      });

      return {
        access_token: token,
        user: user,
      };
    } catch (error) {
      console.log(error);
      throw new Error('Error while logging in');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await compare(password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
