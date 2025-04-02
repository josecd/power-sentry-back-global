import { PartialType } from '@nestjs/mapped-types';
import { CreateModulosDinamicoDto } from './create-modulos-dinamico.dto';

export class UpdateModulosDinamicoDto extends PartialType(CreateModulosDinamicoDto) {}
