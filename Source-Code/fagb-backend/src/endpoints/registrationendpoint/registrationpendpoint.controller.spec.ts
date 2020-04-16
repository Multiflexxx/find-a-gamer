import { Test, TestingModule } from '@nestjs/testing';
 import { RegistrationendpointController } from './registrationendpoint.controller';

describe('Registration Controller', () => {
  let controller: RegistrationendpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationendpointController],
    }).compile();

    controller = module.get<RegistrationendpointController>(RegistrationendpointController);
  });

  it('should be defined', () => {

  });
});
