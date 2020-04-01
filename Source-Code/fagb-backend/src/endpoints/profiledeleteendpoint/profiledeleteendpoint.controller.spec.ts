import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDeleteEndpointController } from './profiledeleteendpoint.controller';
import { RegionEndpointController } from '../region-endpoint/region-endpoint.controller';
import { RegistrationendpointController } from '../registrationendpoint/registrationendpoint.controller';
import { Registration } from '../../data_objects/registration';
import { Region } from '../../data_objects/region';
import { Language } from '../../data_objects/language';
import { Game } from '../../data_objects/game';
import { LoginendpointController } from '../loginendpoint/loginendpoint.controller';
import { Login } from '../../data_objects/login';
import { DeleteProfileRequest } from '../../data_objects/deleteprofilerequest';
import { User } from '../../data_objects/user';
import { LoginResponse } from '../../data_objects/loginresponse';

describe('Profiledeleteendpoint Controller', () => {
  let profileDeleteEndpointController: ProfileDeleteEndpointController;
  let registrationEndpointController: RegistrationendpointController;
  let loginEndpointController: LoginendpointController;
  let registration: Registration;
  let login: Login;
  let loginResponse;
  let deleteProfileRequest;
  let randomNumber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileDeleteEndpointController, RegistrationendpointController, LoginendpointController],
    }).compile();

    profileDeleteEndpointController = module.get<ProfileDeleteEndpointController>(ProfileDeleteEndpointController);
    registrationEndpointController = module.get<RegistrationendpointController>(RegistrationendpointController);
    loginEndpointController = module.get<LoginendpointController>(LoginendpointController);

    randomNumber = Math.floor(Math.random() * 10000);
    registration = new Registration(
      'mail@mail' + randomNumber + '.com',
      'test123',
      'testNickname',
      'testNickname#1234',
      new Date('1999-12-31T23:00:00.000Z'),
      new Region(1, "EU"),
      [
        new Language(1)
      ],
      [
        new Game(1)
      ]
    );

    login = new Login(null, 'mail@mail' + randomNumber + '.com', 'test123', true);

  });

  it('Should create a new registration on database and delete', async () => {

    let registrationResult = await registrationEndpointController.handleRegistration(registration);
    expect(registrationResult).toBeDefined();

    let userId = registrationResult.user_id;

    loginResponse = await loginEndpointController.handleLogin(login);

    let user: User = new User(loginResponse.user_id, 'mail@mail' + randomNumber + '.com', "test123", "testNickname", "testNickname#1234", "", new Date('1999-12-31T23:00:00.000Z'), new Date('1999-12-31T23:00:00.000Z'), "");

    expect(loginResponse).toBeDefined();
    expect(loginResponse.user.user_id).toEqual(userId);

    deleteProfileRequest = new DeleteProfileRequest(loginResponse.session.session_id, user);

    let profileDeleteRequestResult = await profileDeleteEndpointController.handleProfileDeleteRequest(deleteProfileRequest);

    console.log(profileDeleteRequestResult);
    let loginResponse1 = await loginEndpointController.handleLogin(login);
    expect(loginResponse1).toBeDefined();
    expect(loginResponse1).toBeInstanceOf(LoginResponse);
    expect(loginResponse1.session_id).toEqual(loginResponse.session_id);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});