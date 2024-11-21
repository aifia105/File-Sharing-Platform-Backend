import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ access_token: string; user: User }> {
    try {
      const user = await this.validateUserLogin(
        loginDto.email,
        loginDto.password,
      );

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
      throw new NotAcceptableException('Error while logging in');
    }
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ access_token: string; user: User }> {
    try {
      await this.validateUserRegister(registerDto);

      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        process.env.BCRYPT_SALT_ROUNDS,
      );

      const user = {
        ...registerDto,
        password: hashedPassword,
        picture: '',
        filesNumber: 0,
      };

      const newUser = await this.userService.create(user);

      const payload = { email: newUser.email, sub: newUser._id };

      const token = await this.jwtService.signAsync(payload, {
        expiresIn: Number(process.env.JWT_EXPIRATION),
        secret: process.env.JWT_SECRET,
      });

      return {
        access_token: token,
        user: newUser,
      };
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException('Error while registering');
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    try {
      const user = await this.userService.findOneByEmail(
        updatePasswordDto.userEmail,
      );
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (updatePasswordDto.password === updatePasswordDto.confirmPassword) {
        await this.userService.updatePassword(
          user._id.toString(),
          updatePasswordDto.password,
        );
        return 'Password updated successfully';
      }
      throw new UnauthorizedException('Passwords do not match');
    } catch (error) {
      console.log(error);
      throw new NotAcceptableException('Error while updating password');
    }
  }

  async validateUserLogin(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    const isMatch = await compare(password, user.password);
    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  private async validateUserRegister(registerDto: RegisterDto): Promise<any> {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }
    if (registerDto.password.length < 8) {
      throw new UnauthorizedException('Password too short');
    }
    return null;
  }
}
