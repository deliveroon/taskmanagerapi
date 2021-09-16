import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/entity/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAll() {
    const user = this.userService.getAll();
    return user;
  }

  @Get('exist/email/:email')
  async existEmail(@Param('email') email: string) {
    const user = this.userService.existEmail(email);
    return user;
  }

  @Get('exist/username/:username')
  async exist(@Param('username') username: string) {
    const user = this.userService.exist(username);
    return user;
  }

  @Post('sendemail')
  async preInscription(@Body() body: User) {
    const user = this.userService.preInscription(body);
    return user;
  }

  @Put('confirm')
  validationInscription(@Body() body: User) {
    const user = this.userService.validationInscription(body);
    return user;
  }
}
