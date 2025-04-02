import { Injectable } from '@nestjs/common';
import { CreateModulosDinamicoDto } from './dto/create-modulos-dinamico.dto';
import { UpdateModulosDinamicoDto } from './dto/update-modulos-dinamico.dto';

@Injectable()
export class ModulosDinamicosService {
  create(createModulosDinamicoDto: CreateModulosDinamicoDto) {
    return 'This action adds a new modulosDinamico';
  }

  findAll() {
    return `This action returns all modulosDinamicos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modulosDinamico`;
  }

  update(id: number, updateModulosDinamicoDto: UpdateModulosDinamicoDto) {
    return `This action updates a #${id} modulosDinamico`;
  }

  remove(id: number) {
    return `This action removes a #${id} modulosDinamico`;
  }
}
