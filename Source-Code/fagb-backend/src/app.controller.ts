import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConnectToDatabaseService } from './connecttodatabase/connecttodatabase.service';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}
}

