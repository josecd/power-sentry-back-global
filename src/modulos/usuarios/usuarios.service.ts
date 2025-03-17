import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUsuarioDto } from './dto/register-usuario.dto';
import { Permiso } from '../permisos/entities/permiso.entity';
import { classToPlain } from 'class-transformer';
import { uniqBy } from 'lodash';
import { RefreshToken } from './entities/refreshtoken.entity';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) { }

  async registrarUsuario(createUsuarioDto: RegisterUsuarioDto): Promise<Usuario> {
    const { contraseña, email, ...rest } = createUsuarioDto;

    // Validar que el email no esté vacío
    if (!email) {
      throw new BadRequestException('El email es requerido');
    }

    // Validar que la contraseña no esté vacía
    if (!contraseña) {
      throw new BadRequestException('La contraseña es requerida');
    }

    try {
      // Verificar si el usuario ya existe
      const existeUsuario = await this.usuarioRepository.findOne({ where: { email } });
      if (existeUsuario) {
        throw new ConflictException('El usuario con este email ya existe');
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(contraseña, salt);

      // Crear el usuario
      const usuario = this.usuarioRepository.create({
        ...rest,
        email,
        contraseña: hashedPassword,
      });

      // Guardar el usuario en la base de datos
      await this.usuarioRepository.save(usuario);

      // Retornar el usuario creado (sin la contraseña por seguridad)
      const { contraseña: _, ...usuarioSinContraseña } = usuario;
      return usuarioSinContraseña as Usuario;
    } catch (error) {
      // Manejar errores específicos
      if (error.code === '23505') {
        // Código de error de PostgreSQL para duplicados
        throw new ConflictException('El usuario con este email ya existe');
      } else if (error instanceof BadRequestException || error instanceof ConflictException) {
        // Re-lanzar errores de validación o conflicto
        throw error;
      } else {
        // Capturar errores inesperados
        throw new InternalServerErrorException('Error al crear el usuario');
      }
    }
  }

  async crearUsuario(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const { contraseña, email, roles, ...rest } = createUsuarioDto;

    // Validar que el email no esté vacío
    if (!email) {
      throw new BadRequestException('El email es requerido');
    }

    // Validar que la contraseña no esté vacía
    if (!contraseña) {
      throw new BadRequestException('La contraseña es requerida');
    }

    // Validar que se proporcionen roles
    if (!roles || roles.length === 0) {
      throw new BadRequestException('Debe proporcionar al menos un rol');
    }

    try {
      // Verificar si el usuario ya existe
      const existeUsuario = await this.usuarioRepository.findOne({ where: { email } });
      if (existeUsuario) {
        throw new ConflictException('El usuario con este email ya existe');
      }

      // Buscar los roles proporcionados
      const roles_data = await this.rolRepository.findByIds(roles);
      if (roles_data.length !== roles.length) {
        throw new NotFoundException('Uno o más roles no existen');
      }

      // Hash de la contraseña
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(contraseña, salt);

      // Crear el usuario
      const usuario = this.usuarioRepository.create({
        ...rest,
        email,
        contraseña: hashedPassword,
        roles: roles_data, // Asignar los objetos completos de los roles
      });

      // Guardar el usuario en la base de datos
      await this.usuarioRepository.save(usuario);

      // Retornar el usuario creado (sin la contraseña por seguridad)
      const { contraseña: _, ...usuarioSinContraseña } = usuario;
      return usuarioSinContraseña as Usuario;
    } catch (error) {
      // Manejar errores específicos
      if (error.code === '23505') {
        // Código de error de PostgreSQL para duplicados
        throw new ConflictException('El usuario con este email ya existe');
      } else if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        // Re-lanzar errores de validación, conflicto o no encontrado
        throw error;
      } else {
        // Capturar errores inesperados
        throw new InternalServerErrorException('Error al crear el usuario');
      }
    }
  }

  async actualizarUsuario(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const { contraseña, email, roles, ...rest } = updateUsuarioDto;

    // Buscar el usuario por ID
    const usuario = await this.usuarioRepository.findOne({ where: { id }, relations: ['roles'] });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    try {
      // Validar y actualizar el email (si se proporciona)
      if (email && email !== usuario.email) {
        const existeUsuarioConEmail = await this.usuarioRepository.findOne({ where: { email } });
        if (existeUsuarioConEmail) {
          throw new BadRequestException('El email ya está en uso por otro usuario');
        }
        usuario.email = email;
      }

      // Validar y actualizar la contraseña (si se proporciona)
      if (contraseña) {
        const salt = await bcrypt.genSalt();
        usuario.contraseña = await bcrypt.hash(contraseña, salt);
      }

      // Validar y actualizar los roles (si se proporcionan)
      if (roles && roles.length > 0) {
        const roles_data = await this.rolRepository.findByIds(roles);
        if (roles_data.length !== roles.length) {
          throw new NotFoundException('Uno o más roles no existen');
        }
        usuario.roles = roles_data;
      }

      // Actualizar otros campos
      Object.assign(usuario, rest);

      // Guardar los cambios en la base de datos
      await this.usuarioRepository.save(usuario);

      // Retornar el usuario actualizado (sin la contraseña por seguridad)
      const { contraseña: _, ...usuarioActualizado } = usuario;
      return usuarioActualizado as Usuario;
    } catch (error) {
      // Manejar errores específicos
      if (error.code === '23505') {
        // Código de error de PostgreSQL para duplicados
        throw new BadRequestException('El email ya está en uso por otro usuario');
      } else if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        // Re-lanzar errores de validación o no encontrado
        throw error;
      } else {
        // Capturar errores inesperados
        throw new InternalServerErrorException('Error al actualizar el usuario');
      }
    }
  }

  async obtenerPermisosDeUsuario(usuarioId: number): Promise<{
    usuario: any;
    permisos: Permiso[];
  }> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['roles', 'roles.permisos'],
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const permisos = usuario.roles.flatMap((role) => role.permisos);

    // Serializar el usuario excluyendo la contraseña
    const usuarioSerializado = classToPlain(usuario);
    const permisosUnicos = uniqBy(permisos, 'id');

    return {
      usuario: usuarioSerializado,
      permisos: permisosUnicos,
    };
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ relations: ['roles'] });
  }

  async asignarRolAUsuario(usuarioId: number, rolId: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id: usuarioId },
      relations: ['roles'],
    });
    const rol = await this.rolRepository.findOne({ where: { id: rolId } });

    if (usuario && rol) {
      usuario.roles.push(rol);
      return this.usuarioRepository.save(usuario);
    }
    throw new Error('Usuario o Rol no encontrado');
  }

  async validarUsuario(email: string, password: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });

    if (usuario && (await bcrypt.compare(password, usuario.contraseña))) {
      return usuario;
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Método para obtener un usuario por su ID
  async obtenerUsuarioPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }


  //Segurirdad

  async guardarRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({ where: { id: userId } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Crear un nuevo refresh token
    const tokenEntity = this.refreshTokenRepository.create({
      token: refreshToken,
      expiracion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      usuario,
    });

    // Guardar el token en la base de datos
    await this.refreshTokenRepository.save(tokenEntity);
  }

  async revocarToken(userId: number, token: string): Promise<void> {
    // Buscar el token asociado al usuario
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token, usuario: { id: userId } },
    });

    if (!tokenEntity) {
      throw new NotFoundException('Token no encontrado');
    }

    // Eliminar el token
    await this.refreshTokenRepository.remove(tokenEntity);
  }

  async revocarTodosLosTokens(userId: number): Promise<void> {
    // Buscar todos los tokens del usuario
    const tokens = await this.refreshTokenRepository.find({
      where: { usuario: { id: userId } }, // Filtro por usuario
    });
  
    if (tokens.length === 0) {
      throw new NotFoundException('No se encontraron tokens para este usuario');
    }
  
    // Eliminar todos los tokens
    await this.refreshTokenRepository.remove(tokens);
  }

  async validarRefreshToken(userId: number, token: string): Promise<boolean> {
    // Buscar el token en la base de datos
    const tokenEntity = await this.refreshTokenRepository.findOne({
      where: { token, usuario: { id: userId } },
    });
  
    // Verificar si el token existe y no ha expirado
    return !!tokenEntity && tokenEntity.expiracion > new Date();
  }
}