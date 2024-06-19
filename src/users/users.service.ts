import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/CreateUser';
import * as brcypt from 'bcryptjs';
import { ListUserDTO } from './dto/ListUser';
import { UpdateUserDTO } from './dto/UpdateUser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async createUser(userData: CreateUserDTO) {
    const userEntity = new UsersEntity();
    const password = userData.password;
    const passwordHash = await brcypt.hash(password, 10);
    userEntity.name = userData.name;
    userEntity.email = userData.email;
    userEntity.password = passwordHash;
    return await this.userRepository.save(userEntity);
  }

  async listUsers() {
    const savedUsers = await this.userRepository.find();
    const listUsers = savedUsers.map(
      (user) => new ListUserDTO(user.id, user.name, user.password),
    );
    return listUsers;
  }

  async searchForEmail(email: string) {
    const checkEmail = await this.userRepository.findOne({
      where: { email },
    });
    return checkEmail;
  }

  async updateUser(id: string, newData: UpdateUserDTO) {
    await this.userRepository.update(id, newData);
  }

  async deleteUser(id: string) {
    await this.userRepository.delete(id);
  }
}
