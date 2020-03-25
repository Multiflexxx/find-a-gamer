import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifymatchendpointController } from './notifymatchendpoint/notifymatchendpoint.controller';
import { ConnectToDatabaseService } from './connecttodatabase/connecttodatabase.service';
import { RegistrationendpointController } from './registrationendpoint/registrationendpoint.controller';
import { LoginendpointController } from './loginendpoint/loginendpoint.controller';
import { ProfileUpdateEndpointController } from './profileupdateendpoint/profileupdateendpoint.controller';

@Module({
  imports: [],
  controllers: [AppController, NotifymatchendpointController, RegistrationendpointController, LoginendpointController, ProfileUpdateEndpointController],
  providers: [AppService, ConnectToDatabaseService],
})
export class AppModule {}
