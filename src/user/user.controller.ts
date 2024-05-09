import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Req,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';

import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { Request } from 'express';
import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { User } from './decorators/user.decorator';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserType } from './types/user.type';
@Controller()
export class UserContreller {
  constructor(private readonly userService: UserService) {}
  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    console.log('createUserDto: ', createUserDto);
    const user = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(user);
  }
  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const loginUser = await this.userService.loginUser(loginUserDto);
    return this.userService.buildUserResponse(loginUser);
  }
  @Get('user')
  @UseGuards(AuthGuard)
  async currentUser(
    @User() user: UserEntity,
    @User('id') userId: number,
  ): Promise<UserResponseInterface> {
    console.log(userId);
    return this.userService.buildUserResponse(user);
  }
  @Put('user')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateUser(
    @User('id') id: number,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const updateUser = await this.userService.updateUser(id, updateUserDto);
    console.log('updateUser: ', updateUser);
    return this.userService.buildUserResponse(updateUser);
  }
}
