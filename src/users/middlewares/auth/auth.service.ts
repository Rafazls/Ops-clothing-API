import { Injectable } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
//import { UsersEntity } from 'src/users/users.entity';
//import { UsersService } from 'src/users/users.service';
//import { Repository } from 'typeorm';
//import { usersGoogle } from './google/dto/usersGoogle';

//  @Injectable()
//  export class AuthUsersService {
//    constructor(
//      @InjectRepository(UsersEntity)
//      private readonly userRepository: Repository<UsersEntity>,
//    ) {}
//
//    async searchForEmail(email: string) {
//      const checkEmail = await this.userRepository.findOne({
//        where: { email },
//      });
//      return checkEmail;
//    }
//  }

// CASO DE MERDA, DA UM CRTL Z

@Injectable()
export class AuthUsersService {
  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to revoke the token:', error);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to revoke the token:', error);
    }
  }
}
