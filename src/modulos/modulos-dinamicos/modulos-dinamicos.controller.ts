import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModulosDinamicosService } from './modulos-dinamicos.service';
import { CreateModulosDinamicoDto } from './dto/create-modulos-dinamico.dto';
import { UpdateModulosDinamicoDto } from './dto/update-modulos-dinamico.dto';

@Controller('modulos-dinamicos')
export class ModulosDinamicosController {
  constructor(private readonly modulosDinamicosService: ModulosDinamicosService) {}

  @Post()
  create(@Body() createModulosDinamicoDto: CreateModulosDinamicoDto) {
    return this.modulosDinamicosService.create(createModulosDinamicoDto);
  }

  @Get()
  findAll() {
    return this.modulosDinamicosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulosDinamicosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModulosDinamicoDto: UpdateModulosDinamicoDto) {
    return this.modulosDinamicosService.update(+id, updateModulosDinamicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulosDinamicosService.remove(+id);
  }
}
