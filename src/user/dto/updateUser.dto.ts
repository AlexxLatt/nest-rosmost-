import { IsEmail } from 'class-validator';

export class UpdateUserDto {
  username: string;
  @IsEmail()
  email: string;
  address: string;
  password: string;
  img: string;
}
