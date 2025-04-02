import { Module } from '@nestjs/common';
import { ModulosDinamicosService } from './modulos-dinamicos.service';
import { ModulosDinamicosController } from './modulos-dinamicos.controller';

@Module({
  controllers: [ModulosDinamicosController],
  providers: [ModulosDinamicosService],
})
export class ModulosDinamicosModule {}
