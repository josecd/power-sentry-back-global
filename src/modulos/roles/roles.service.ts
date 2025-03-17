import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Permiso } from '../permisos/entities/permiso.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) { }


  async crearRol(nombre: string, descripcion: string, permisosIds: number[]): Promise<Role> {
    // Verificar si los permisos existen
    const permisos = await this.permisoRepository.findByIds(permisosIds);
    if (permisos.length !== permisosIds.length) {
      throw new NotFoundException('Uno o más permisos no existen');
    }
  
    // Crear el rol y asignar los permisos
    const rol = this.rolRepository.create({ nombre, descripcion });
    rol.permisos = permisos;
  
    // Guardar el rol en la base de datos
    return this.rolRepository.save(rol);
  }

  async editarRol(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Buscar el rol por ID
    const rol = await this.rolRepository.findOne({
      where: { id },
      relations: ['permisos'], // Cargar los permisos asociados
    });
  
    if (!rol) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  
    // Actualizar nombre y descripción si se proporcionan
    if (updateRoleDto.nombre !== undefined) {
      rol.nombre = updateRoleDto.nombre;
    }
  
    if (updateRoleDto.descripcion !== undefined) {
      rol.descripcion = updateRoleDto.descripcion;
    }
  
    // Actualizar permisos si se proporcionan
    if (updateRoleDto.permisosIds !== undefined) {
      const permisos = await this.permisoRepository.findByIds(updateRoleDto.permisosIds);
      if (permisos.length !== updateRoleDto.permisosIds.length) {
        throw new NotFoundException('Uno o más permisos no existen');
      }
      rol.permisos = permisos;
    }
  
    // Guardar los cambios en la base de datos
    return this.rolRepository.save(rol);
  }


}
