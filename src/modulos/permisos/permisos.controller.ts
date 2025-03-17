import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CrearPermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) { }

  @Post("crear")
  async crearPermiso(@Body() crearPermisoDto: CrearPermisoDto) {
    try {
      console.log("crear", crearPermisoDto);
      
      return await this.permisosService.crearPermiso(crearPermisoDto);
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

  @Patch('editar/:id')
  async editarPermiso(
    @Param('id') id: number,
    @Body() updatePermisoDto: UpdatePermisoDto,
  ) {
    return this.permisosService.editarPermiso(id, updatePermisoDto);
  }

  @Post('/inicio')
  async createFirstSystem() {
    // Crear permisos iniciales usando objetos de tipo CrearPermisoDto
    await this.permisosService.crearPermiso({
      nombre: 'Crear usuarios',
      identificador: 'crear_usuario',
      descripcion: 'Puede crear usuarios en el sistema',
    });

    await this.permisosService.crearPermiso({
      nombre: 'Editar usuarios',
      identificador: 'editar_usuario',
      descripcion: 'Puede editar los usuarios',
    });

    await this.permisosService.crearPermiso({
      nombre: 'Eliminar usuarios',
      identificador: 'eliminar_usuario',
      descripcion: 'Puede eliminar los usuarios',
    });

    await this.permisosService.crearPermiso({
      nombre: 'Ver usuarios',
      identificador: 'ver_usuarios',
      descripcion: 'Puede ver los usuarios',
    });

    return "OK";
  }
}
