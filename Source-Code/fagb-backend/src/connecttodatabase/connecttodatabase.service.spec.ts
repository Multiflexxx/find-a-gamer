import { Test, TestingModule } from '@nestjs/testing';
import { ConnectToDatabaseService } from './connecttodatabase.service';

describe('ConnectToDatabaseService', () => {
  let service: ConnectToDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectToDatabaseService],
    }).compile();

    service = module.get<ConnectToDatabaseService>(ConnectToDatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
