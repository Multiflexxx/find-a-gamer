import { Test, TestingModule } from '@nestjs/testing';
import { SignupendpointController } from './signupendpoint.controller';

describe('Signupendpoint Controller', () => {
  let controller: SignupendpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignupendpointController],
    }).compile();

    controller = module.get<SignupendpointController>(SignupendpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
