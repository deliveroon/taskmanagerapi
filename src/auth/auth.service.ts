/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getUser(username);

    var hash = CryptoJS.SHA512(pass).toString();

    if(!user){
      return null;
    }

    if (user.password === hash) {
      const { password, ...result } = user;
      return result;
    } else {
      return null;
    }
  }
  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token: access_token,
    };
  }
}
