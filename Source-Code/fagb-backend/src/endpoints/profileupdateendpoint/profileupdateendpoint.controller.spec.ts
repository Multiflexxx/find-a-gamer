import { Test, TestingModule } from '@nestjs/testing';
import { ProfileUpdateEndpointController } from './profileupdateendpoint.controller';
import { Login } from '../../data_objects/login';
import { LoginendpointController } from '../loginendpoint/loginendpoint.controller';
import { Registration } from '../../data_objects/registration';
import { RegistrationendpointController } from '../registrationendpoint/registrationendpoint.controller';
import { Region } from '../../data_objects/region';
import { Language } from '../../data_objects/language';
import { Game } from '../../data_objects/game';
import { User } from '../../data_objects/user';
import { DeleteProfileRequest } from '../../data_objects/deleteprofilerequest';
import { LoginResponse } from '../../data_objects/loginresponse';
import { ProfileDeleteEndpointController } from '../profiledeleteendpoint/profiledeleteendpoint.controller';
import { async } from 'rxjs/internal/scheduler/async';
import { EditProfileRequest } from '../../data_objects/editprofilerequest';
import { PublicUser } from '../../data_objects/publicuser';
import { Discord } from '../../factory/discord';

describe('Profileupdateendpoint Controller', () => {
  let profileUpdateController: ProfileUpdateEndpointController;
  let profileDeleteEndpointController: ProfileDeleteEndpointController;
  let registrationEndpointController: RegistrationendpointController;
  let loginEndpointController: LoginendpointController;
  let registration: Registration;
  let login: Login;
  let loginResponse: LoginResponse;
  let deleteProfileRequest: DeleteProfileRequest;
  const randomNumber: number = Math.floor(Math.random() * 10000);;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [ProfileDeleteEndpointController, RegistrationendpointController, LoginendpointController, ProfileUpdateEndpointController],
      }).compile();

    profileUpdateController = module.get<ProfileUpdateEndpointController>(ProfileUpdateEndpointController);
    profileDeleteEndpointController = module.get<ProfileDeleteEndpointController>(ProfileDeleteEndpointController);
    registrationEndpointController = module.get<RegistrationendpointController>(RegistrationendpointController);
    loginEndpointController = module.get<LoginendpointController>(LoginendpointController);

    let discordToken: string = await Discord.saveDiscordInformation('65546434', 'testNickname', '', '1234');

    registration = new Registration(
      'mail@mail' + randomNumber + '.com',
      'test123',
      'testNickname',
      'testNickname#1234',
      new Date('1999-12-31T23:00:00.000Z'),
      new Region(1, 'EU'),
      [
        new Language(1)
      ],
      [
        new Game(1)
      ], discordToken
    );

    login = new Login(null, 'mail@mail' + randomNumber + '.com', 'test123', true);
  });

  it('Should create a new registration on database, update profile and delete user', async () => {

    const registrationResult = await registrationEndpointController.handleRegistration(registration);
    expect(registrationResult).toBeDefined();

    const userId = registrationResult.user_id;

    loginResponse = await loginEndpointController.handleLogin(login);

    const user: PublicUser = new PublicUser(loginResponse.user.user_id, 'testNickname', 'testNickname#1234', new Date('1999-12-31T23:00:00.000Z'), new Region(1, 'EU'), [new Game(1)], [new Language(1)]);

    expect(loginResponse).toBeDefined();
    expect(loginResponse.user.user_id).toEqual(userId);
    expect(loginResponse.user.biography).toEqual(' ');

    // update
    const publicUser: PublicUser = new PublicUser(userId, 'testNickname', 'testNickname#1234', new Date('1999-12-31T23:00:00.000Z'), new Region(1, 'EU'), [new Game(1), new Game(2)], [new Language(1), new Language(2)], '', 'new Bio');
    const editProfileRequest: EditProfileRequest = new EditProfileRequest(loginResponse.session.session_id, publicUser, 'test123', 'test1234');

    const editProfileResult = await profileUpdateController.handleProfileUpdateRequest(editProfileRequest);
    expect(editProfileResult.publicUser.biography).toEqual('new Bio');

    deleteProfileRequest = new DeleteProfileRequest(loginResponse.session.session_id, user);

    try {
      const profileDeleteRequestResult = await profileDeleteEndpointController.handleProfileDeleteRequest(deleteProfileRequest);
    }
    catch (e) {
      console.log(e);
    }

    let loginResponse1: LoginResponse;

    try {
      loginResponse1 = await loginEndpointController.handleLogin(login);
    } catch (e) {
      expect(e.status).toEqual(401);
      expect(e.response.error).toEqual('No user with that Email');
    }

    expect(loginResponse1).toBeUndefined();
  }, 10000);
});
