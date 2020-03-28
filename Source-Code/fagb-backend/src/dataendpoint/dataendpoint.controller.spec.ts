import { Test, TestingModule } from '@nestjs/testing';
import { DataendpointController } from './dataendpoint.controller';

describe('Dataendpoint Controller', () => {
  let controller: DataendpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataendpointController],
    }).compile();

    controller = module.get<DataendpointController>(DataendpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
