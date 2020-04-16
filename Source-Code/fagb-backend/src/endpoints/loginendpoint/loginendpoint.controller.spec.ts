import { Test, TestingModule } from '@nestjs/testing';
import { Login } from '../../data_objects/login';
import { LoginendpointController } from './loginendpoint.controller';
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

describe('Loginendpoint Controller', () => {
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
      controllers: [ProfileDeleteEndpointController, RegistrationendpointController, LoginendpointController],
    }).compile();

    profileDeleteEndpointController = module.get<ProfileDeleteEndpointController>(ProfileDeleteEndpointController);
    registrationEndpointController = module.get<RegistrationendpointController>(RegistrationendpointController);
    loginEndpointController = module.get<LoginendpointController>(LoginendpointController);

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
      ]
    );

    login = new Login(null, 'mail@mail' + randomNumber + '.com', 'test123', true);
  });

    it('Should try a login with wrong mail', async() => {
      const testLogin = new Login(null, 'mail@mail'+randomNumber+'.com', 'test123', true);
      let testloginResponse: LoginResponse;

      try {
        testloginResponse = await loginEndpointController.handleLogin(testLogin);
      } catch (e) {
        expect(e.status).toEqual(401);
        expect(e.response.error).toEqual('No user with that Email');
      }
    });

  it('Should create a new registration on database and delete', async () => {

    const registrationResult = await registrationEndpointController.handleRegistration(registration);
    expect(registrationResult).toBeDefined();

    const userId = registrationResult.user_id;

    loginResponse = await loginEndpointController.handleLogin(login);

    const user: User = new User(userId, 'mail@mail' + randomNumber + '.com', 'test123', 'testNickname', 'testNickname#1234', '', new Date('1999-12-31T23:00:00.000Z'), new Date('1999-12-31T23:00:00.000Z'), '');

    expect(loginResponse).toBeDefined();
    expect(loginResponse.user.user_id).toEqual(userId);

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
