import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, UseInterceptors, ClassSerializerInterceptor, NotFoundException, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { LoginDto } from '../../auth/dto/login.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post('/init')
  async init(@Body() usuario: Usuario) {
    // Asignar rol "Administrador" al usuario con ID 1
    await this.usuariosService.asignarRolAUsuario(1, 1);
    // Asignar rol "Editor" al usuario con ID 2
    //await this.usuariosService.asignarRolAUsuario(2, 2); 
    return "OK"
  }

  @Post('register')
  async registerUsuario(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuariosService.registrarUsuario(usuario);
  }

  @Post('create')
  async crearUsuario(@Body() usuario: Usuario): Promise<Usuario> {
    return this.usuariosService.crearUsuario(usuario);
  }

  @Put(':id')
  async actualizarUsuario(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    const usuarioActualizado = await this.usuariosService.actualizarUsuario(
      +id, // Convertir el ID a número
      updateUsuarioDto,
    );

    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuarioActualizado;
  }


  @Get('list')
  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuariosService.obtenerUsuarios();
  }

  @Get(':id/permisos')
  @UseInterceptors(ClassSerializerInterceptor) // Opcional: para excluir propiedades con class-transformer
  async obtenerPermisosDeUsuario(@Param('id') id: string): Promise<{
    usuario: Usuario;
    permisos: any[];
  }> {
    const usuarioId = parseInt(id, 10); // Convertir el ID a número
    if (isNaN(usuarioId)) {
      throw new NotFoundException('ID de usuario no válido');
    }
    return this.usuariosService.obtenerPermisosDeUsuario(usuarioId);
  }
}
