import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as exc from '@base/api/exception.reslover';
import { UserService } from '@/user/user.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  UpdatePasswordDto,
} from './dtos/auth.dto';
import { IJWTPayload } from './interfaces/auth.interface';
import { EState } from '@/shared/enum/common.enum';
import { MailerService } from '@/base/mailer/mailer.service';
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.comparePassword(pass)) {
      delete user.password;
      return user;
    }
    return null;
  }

  async login(dto: LoginDto): Promise<any> {
    const { username, password } = dto;
    const user = await this.userService.findByUsername(username);

    if (!user || !user.comparePassword(password))
      throw new exc.BadExcetion({
        message: 'username or password does not exists',
      });

    if (user.status === EState.Deactivated) {
      throw new exc.BadExcetion({ message: 'Tài khoản đã bị khóa' });
    }

    const payload: IJWTPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      ...user,
      accessToken: accessToken,
    };
  }

  async forgotPassword(payload: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(payload.email);

    if (!user)
      throw new exc.BadRequest({ message: 'Không tồn tại tài khoản này' });

    const pass = String(Math.floor(Math.random() * 100000) + 100000);
    user.setPassword(pass);

    const data = this.readFile('forgot-password.html');
    const template = handlebars.compile(data);

    await this.mailService.sendMail(
      payload.email,
      'Mật khẩu mới',
      template({ newPassword: pass }),
    );

    return user.save();
  }

  async updatePassword(payload: UpdatePasswordDto, user: User) {
    const tmpUser = await this.userService.getUserById(user.id);

    if (!tmpUser.comparePassword(payload.password))
      throw new exc.BadRequest({ message: 'Password is not correct!' });

    tmpUser.setPassword(payload.new_password);
    return tmpUser.save();
  }

  readFile(fileName: string) {
    const pathFile = path.join(
      process.cwd(),
      '/src/base/mailer/templates',
      fileName,
    );
    const data = fs.readFileSync(pathFile, 'utf-8');
    return data.toString();
  }
}
