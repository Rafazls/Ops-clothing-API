import { Module } from '@nestjs/common';
import { AuthUsersController } from './auth.controller';
import { AuthUsersService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { GoogleOauthStrategy } from './google/google.strategy';
import { UsersEntity } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [AuthUsersController],
  providers: [AuthUsersService, UsersService, GoogleOauthStrategy],
})
export class AuthUsersModule {}
