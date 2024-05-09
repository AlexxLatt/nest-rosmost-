import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '@app/config';
import { UserResponseInterface } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcrypt';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByEmail = await this.userRepository.findOne({
      email: createUserDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createUserDto.username,
    });
    if (userByEmail || userByUsername) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const newUser = new UserEntity();
    Object.assign(newUser, createUserDto);
    console.log('newUser: ', newUser);
    return await this.userRepository.save(newUser);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne(
      {
        email: loginUserDto.email,
      },
      { select: ['id', 'address', 'email', 'img', 'username', 'password'] },
    );

    // Проверка наличия пользователя с таким email
    if (!user) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    // Сравнение хэшированного пароля из базы данных с введенным пользователем паролем
    const isPasswordValid = await compare(loginUserDto.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    delete user.password;
    // Возврат данных пользователя, если email и пароль верные
    return user;
  }
  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
  genereteJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET,
    );
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.genereteJwt(user),
      },
    };
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const userToUpdate = await this.userRepository.findOne(id);

    if (!userToUpdate) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.email) {
      const userByEmail = await this.userRepository.findOne({
        email: updateUserDto.email,
      });
      if (userByEmail && userByEmail.id !== id) {
        throw new HttpException(
          'Email is already taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (updateUserDto.username) {
      const userByUsername = await this.userRepository.findOne({
        username: updateUserDto.username,
      });
      if (userByUsername && userByUsername.id !== id) {
        throw new HttpException(
          'Username is already taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    Object.assign(userToUpdate, updateUserDto);

    const updatedUser = await this.userRepository.save(userToUpdate);

    return updatedUser;
  }
}
