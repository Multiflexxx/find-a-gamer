import { Test, TestingModule } from '@nestjs/testing';
import { LoginendpointController } from './loginendpoint.controller';

describe('Loginendpoint Controller', () => {
  let controller: LoginendpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginendpointController],
    }).compile();

    controller = module.get<LoginendpointController>(LoginendpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
