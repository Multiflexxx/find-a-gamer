import { Test, TestingModule } from '@nestjs/testing';
import { ConnecttodatabaseService } from './connecttodatabase.service';

describe('ConnecttodatabaseService', () => {
  let service: ConnecttodatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnecttodatabaseService],
    }).compile();

    service = module.get<ConnecttodatabaseService>(ConnecttodatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
