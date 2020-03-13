import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifymatchendpointController } from './notifymatchendpoint/notifymatchendpoint.controller';

@Module({
  imports: [],
  controllers: [AppController, NotifymatchendpointController],
  providers: [AppService],
})
export class AppModule {}
