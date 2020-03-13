import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifymatchendpointController } from './notifymatchendpoint/notifymatchendpoint.controller';
import { ConnectToDatabaseService } from './connecttodatabase/connecttodatabase.service';

@Module({
  imports: [],
  controllers: [AppController, NotifymatchendpointController],
  providers: [AppService, ConnectToDatabaseService],
})
export class AppModule {}
