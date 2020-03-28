import { Test, TestingModule } from '@nestjs/testing';
import { NotifymatchendpointController } from './notifymatchendpoint.controller';

describe('Notifymatchendpoint Controller', () => {
  let controller: NotifymatchendpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifymatchendpointController],
    }).compile();

    controller = module.get<NotifymatchendpointController>(NotifymatchendpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
