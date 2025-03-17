import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';
import { Repository } from 'typeorm';
import { CrearPermisoDto } from './dto/create-permiso.dto';

@Injectable()
export class PermisosService {

  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async crearPermiso(crearPermisoDto: CrearPermisoDto): Promise<Permiso> {
    // Reemplazar espacios con guiones bajos en el identificador
    crearPermisoDto.identificador = crearPermisoDto.identificador.replace(/\s+/g, '_');

    try {
      const permiso = this.permisoRepository.create(crearPermisoDto);

      return await this.permisoRepository.save(permiso);
    } catch (error) {
      throw new NotFoundException(
        `Error al crear el permiso: ${error.message}`,
      );
    }
  }

  async editarPermiso(
    id: number,
    updatePermisoDto: UpdatePermisoDto,
  ): Promise<Permiso> {
    // Buscar el permiso por ID
    const permiso = await this.permisoRepository.findOne({ where: { id } });
  
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  
    // Bandera para verificar si hay cambios
    let hayCambios = false;
  
    // Validar y actualizar cada campo individualmente
    if (updatePermisoDto.nombre !== undefined && updatePermisoDto.nombre !== permiso.nombre) {
      permiso.nombre = updatePermisoDto.nombre;
      hayCambios = true;
    }
  
    if (updatePermisoDto.identificador !== undefined) {
      const nuevoIdentificador = updatePermisoDto.identificador.replace(/\s+/g, '_');
  
      // Verificar si el nuevo identificador ya existe en otro permiso
      const permisoExistente = await this.permisoRepository.findOne({
        where: { identificador: nuevoIdentificador },
      });
  
      if (permisoExistente && permisoExistente.id !== id) {
        throw new ConflictException(
          `El identificador '${nuevoIdentificador}' ya está en uso.`,
        );
      }
  
      if (nuevoIdentificador !== permiso.identificador) {
        permiso.identificador = nuevoIdentificador;
        hayCambios = true;
      }
    }
  
    if (updatePermisoDto.descripcion !== undefined && updatePermisoDto.descripcion !== permiso.descripcion) {
      permiso.descripcion = updatePermisoDto.descripcion;
      hayCambios = true;
    }
  
    // Si no hay cambios, devolver el permiso actual
    if (!hayCambios) {
      return permiso;
    }
  
    try {
      // Guardar los cambios en la base de datos
      return await this.permisoRepository.save(permiso);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `El identificador '${updatePermisoDto.identificador}' ya está en uso.`,
        );
      }
      throw new NotFoundException(
        `Error al actualizar el permiso: ${error.message}`,
      );
    }
  }
}
