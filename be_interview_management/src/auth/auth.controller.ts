import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  UpdatePasswordDto,
} from './dtos/auth.dto';
import { GetUser } from './decorator/get-user.decorator';
import { User } from '@/user/entities/user.entity';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('get-me')
  async getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('update-password')
  async updatePassword(
    @Body() payload: UpdatePasswordDto,
    @GetUser() user: User,
  ) {
    return this.authService.updatePassword(payload, user);
  }

  @Public()
  @Post('fogot-password')
  async forgotPassword(@Body() payload: ForgotPasswordDto) {
    return this.authService.forgotPassword(payload);
  }
}
