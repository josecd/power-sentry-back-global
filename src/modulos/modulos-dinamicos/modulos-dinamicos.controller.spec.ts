import { Test, TestingModule } from '@nestjs/testing';
import { ModulosDinamicosController } from './modulos-dinamicos.controller';
import { ModulosDinamicosService } from './modulos-dinamicos.service';

describe('ModulosDinamicosController', () => {
  let controller: ModulosDinamicosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModulosDinamicosController],
      providers: [ModulosDinamicosService],
    }).compile();

    controller = module.get<ModulosDinamicosController>(ModulosDinamicosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
