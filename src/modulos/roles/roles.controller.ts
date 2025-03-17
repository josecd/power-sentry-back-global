import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  async crearRol(@Body() createRoleDto: CreateRoleDto) {
   
    try {
      return await this.rolesService.crearRol(
        createRoleDto.nombre,
        createRoleDto.descripcion,
        createRoleDto.permisosIds,
      );
  
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  async editarRol(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.editarRol(id, updateRoleDto);
  }

  @Post('/init')
  async create(@Body() createRoleDto: CreateRoleDto) {
    // Crear rol "Administrador" con todos los permisos
    const permisosIds = [1, 2, 3, 4]; // IDs de los permisos
    await this.rolesService.crearRol('Administrador', 'Rol con todos los permisos', permisosIds);

    // Crear rol "Editor" con permisos específicos
    const permisosEditorIds = [2, 4]; // IDs de "editar_usuario" y "ver_usuarios"
    await this.rolesService.crearRol('Editor', 'Solo puede editar un usuario', permisosEditorIds);

    // Crear rol "Lector" con permisos específicos
    const permisosLectorIds = [4]; // ID de "ver_usuarios"
    await this.rolesService.crearRol('Lector', 'Solo puede ver los usuarios', permisosLectorIds);

    return true
  }
}
