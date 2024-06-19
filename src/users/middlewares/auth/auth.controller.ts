import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { VerifyUserDTO } from '../../dto/ListUser';
import { CreateUserDTO } from 'src/users/dto/CreateUser';
import { AuthUsersService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { CheckTokenExpiryGuard } from './guards/auth.guard';
import { Response } from 'express';

@Controller('/auth')
export class AuthUsersController {
  constructor(
    private readonly authUserService: AuthUsersService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Login Controller default
  @HttpCode(HttpStatus.OK)
  @Post('/signIn')
  async signIn(@Body() verifyUser: VerifyUserDTO) {
    try {
      const userData = await this.usersService.searchForEmail(verifyUser.email);

      if (!userData) {
        throw new HttpException(
          'Usuário não encontrado.',
          HttpStatus.NOT_FOUND,
        );
      }

      const isMatch = await bcrypt.compare(
        verifyUser.password,
        userData.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Senha incorreta.');
      }

      return {
        access_token: await this.jwtService.signAsync({
          email: userData.email,
        }),
      };
    } catch (error) {
      this.handleException(error, 'Erro ao autenticar usuário.');
    }
  }

  private handleException(error: any, defaultMessage: string) {
    if (
      error.status === HttpStatus.NOT_FOUND ||
      error.status === HttpStatus.UNAUTHORIZED
    ) {
      throw error;
    }
    console.error(error);
    throw new HttpException(defaultMessage, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  private async verifyEmailExists(email: string): Promise<boolean> {
    return (await this.usersService.searchForEmail(email)) !== null;
  }

  // SignUp Controller default
  @HttpCode(HttpStatus.OK)
  @Post('/create')
  async createUser(@Body() userData: CreateUserDTO) {
    try {
      if (await this.verifyEmailExists(userData.email)) {
        throw new HttpException(
          'Já existe um usuário com este e-mail',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.usersService.createUser(userData);
      console.log('Usuário criado com sucesso');
      return { message: 'Usuário criado com sucesso' };
    } catch (error) {
      console.error('Erro ao criar usuário', error);
      throw error;
    }
  }

  //Google Authentification
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res: Response) {
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;

    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', googleRefreshToken, {
      httpOnly: true,
    });
    res.redirect('http://localhost:3000/auth/profile');
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken)
      return (await this.authUserService.getProfile(accessToken)).data;
    throw new UnauthorizedException('No access token');
  }
}
