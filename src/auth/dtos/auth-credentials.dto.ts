import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  state: string;

  @IsString()
  homeAddress: string;
}

export class AuthenticateUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
