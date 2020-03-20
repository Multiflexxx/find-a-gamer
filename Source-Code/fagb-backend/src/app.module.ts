import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifymatchendpointController } from './notifymatchendpoint/notifymatchendpoint.controller';
import { ConnectToDatabaseService } from './connecttodatabase/connecttodatabase.service';
import { RegistrationendpointController } from './registrationendpoint/registrationendpoint.controller';

@Module({
  imports: [],
  controllers: [AppController, NotifymatchendpointController, RegistrationendpointController],
  providers: [AppService, ConnectToDatabaseService],
})
export class AppModule {}
