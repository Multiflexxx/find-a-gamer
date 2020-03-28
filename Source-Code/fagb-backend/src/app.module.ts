import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifymatchendpointController } from './notifymatchendpoint/notifymatchendpoint.controller';
import { ConnectToDatabaseService } from './connecttodatabase/connecttodatabase.service';
import { RegistrationendpointController } from './registrationendpoint/registrationendpoint.controller';
import { LoginendpointController } from './loginendpoint/loginendpoint.controller';
import { ProfileUpdateEndpointController } from './profileupdateendpoint/profileupdateendpoint.controller';
import { ProfileDeleteEndpointController } from './profiledeleteendpoint/profiledeleteendpoint.controller';

@Module({
  imports: [],
  controllers: [AppController, NotifymatchendpointController, RegistrationendpointController, LoginendpointController, ProfileUpdateEndpointController, ProfileDeleteEndpointController],
  providers: [AppService, ConnectToDatabaseService],
})
export class AppModule {}
