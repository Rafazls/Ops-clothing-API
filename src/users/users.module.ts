import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UniqueEmailValidator } from './validations/UniqueEmailValidator';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [UsersController],
  providers: [UsersService, UniqueEmailValidator],
})
export class UsersModule {}
