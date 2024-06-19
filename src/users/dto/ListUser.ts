import { IsEmail, MinLength } from 'class-validator';

export class ListUserDTO {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly password: string,
  ) {}
}
export class VerifyUserDTO {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres' })
  password: string;
}
