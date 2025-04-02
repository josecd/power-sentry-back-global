import { Test, TestingModule } from '@nestjs/testing';
import { ModulosDinamicosService } from './modulos-dinamicos.service';

describe('ModulosDinamicosService', () => {
  let service: ModulosDinamicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModulosDinamicosService],
    }).compile();

    service = module.get<ModulosDinamicosService>(ModulosDinamicosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
