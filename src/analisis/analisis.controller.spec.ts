import { Test, TestingModule } from '@nestjs/testing';
import { AnalisisController } from './analisis.controller';
import { AnalisisService } from './analisis.service';

describe('AnalisisController', () => {
  let controller: AnalisisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalisisController],
      providers: [AnalisisService],
    }).compile();

    controller = module.get<AnalisisController>(AnalisisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
