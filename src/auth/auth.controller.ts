import { Controller, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  async login() {}

  @UseGuards(LocalAuthGuard)
  async register() {}

  @UseGuards(LocalAuthGuard)
  async logout() {}
}
