import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDTO } from './dto/UpdateUser';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './middlewares/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async listUsuarios() {
    const usuariosSalvos = await this.usersService.listUsers();
    return usuariosSalvos;
  }

  @Put('/:id')
  async atualizaUsuario(
    @Param('id') id: string,
    @Body() novosDados: UpdateUserDTO,
  ) {
    const usuarioAtualizado = await this.usersService.updateUser(
      id,
      novosDados,
    );

    return {
      usuario: usuarioAtualizado,
      messagem: 'usuário atualizado com sucesso',
    };
  }

  @Delete('/:id')
  async removeUsuario(@Param('id') id: string) {
    const usuarioRemovido = await this.usersService.deleteUser(id);

    return {
      usuario: usuarioRemovido,
      messagem: 'usuário removido com suceso',
    };
  }
}
