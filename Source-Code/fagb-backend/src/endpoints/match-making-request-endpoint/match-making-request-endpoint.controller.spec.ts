import { Test, TestingModule } from '@nestjs/testing';
import { MatchMakingRequestEndpointController } from './match-making-request-endpoint.controller';
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
import { PublicUser } from '../../data_objects/publicuser';
import { MatchMakingRequest } from '../../data_objects/matchmakingrequest';
import { MatchMakingResponse } from '../../data_objects/matchmakingresponse';
import { DeleteMatchMakingRequest } from '../../data_objects/deletematchmakingrequest';
import { DeleteRequestEndpointController } from '../delete-request-endpoint/delete-request-endpoint.controller';
import { DeleteProfileResponse } from '../../data_objects/deleteprofileresponse';
import { DeleteMatchMakingResponse } from '../../data_objects/deletematchmakingresponse';

describe('MatchMakingRequestEndpoint Controller', () => {
  let matchMakingController: MatchMakingRequestEndpointController;

  let profileDeleteEndpointController: ProfileDeleteEndpointController;
  let registrationEndpointController: RegistrationendpointController;
  let loginEndpointController: LoginendpointController;
  let registration: Registration;
  let login: Login;
  let loginResponse: LoginResponse;
  let deleteProfileRequest: DeleteProfileRequest;
  let deleteRequestEndpointController: DeleteRequestEndpointController;
  const randomNumber: number = Math.floor(Math.random() * 10000);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileDeleteEndpointController, RegistrationendpointController, LoginendpointController, MatchMakingRequestEndpointController, DeleteRequestEndpointController],
    }).compile();

    matchMakingController = module.get<MatchMakingRequestEndpointController>(MatchMakingRequestEndpointController);
    profileDeleteEndpointController = module.get<ProfileDeleteEndpointController>(ProfileDeleteEndpointController);
    registrationEndpointController = module.get<RegistrationendpointController>(RegistrationendpointController);
    loginEndpointController = module.get<LoginendpointController>(LoginendpointController);
    deleteRequestEndpointController = module.get<DeleteRequestEndpointController>(DeleteRequestEndpointController);

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

  it('should create a user, login, search a match, delete match and delete user', async () => {
    const registrationResult = await registrationEndpointController.handleRegistration(registration);
    expect(registrationResult).toBeDefined();

    const userId = registrationResult.user_id;

    loginResponse = await loginEndpointController.handleLogin(login);

    const user: User = new User(userId, 'mail@mail' + randomNumber + '.com', 'test123', 'testNickname', 'testNickname#1234', '', new Date('1999-12-31T23:00:00.000Z'), new Date('1999-12-31T23:00:00.000Z'), '');

    expect(loginResponse).toBeDefined();
    expect(loginResponse.user.user_id).toEqual(userId);

    // matchmaking
    const publicUser: PublicUser = new PublicUser(userId, 'testNickname', 'testNickname#1234', new Date('1999-12-31T23:00:00.000Z'), new Region(1, 'EU'), [new Game(1), new Game(2)], [new Language(1), new Language(2)], '', 'new Bio');
    const matchmakingRequest: MatchMakingRequest = new MatchMakingRequest(loginResponse.session.session_id, loginResponse.user.user_id, 1, 1, 1, true);

    const matchMakingResult = await matchMakingController.requestMatch(matchmakingRequest);

    expect(matchMakingResult).toBeDefined();
    expect(matchMakingResult.game.game_id).toEqual(1);

    const requestID = matchMakingResult.matchmaking_request.request_id;

    // matchmaking does exist
    let matchmakingResult2: MatchMakingResponse;
    try {
      matchmakingResult2 = await matchMakingController.requestMatch(matchmakingRequest);
    } catch (e) {
      expect(e.status).toEqual(409);
      expect(e.response.error).toEqual('User already has open Matchmaking Request');
    }

    // delete matchmaking request
    const deleteMatchMaking: DeleteMatchMakingRequest = new DeleteMatchMakingRequest(loginResponse.session.session_id, requestID);

    expect(deleteMatchMaking).toBeDefined();

    let deleteRequestResult: DeleteMatchMakingResponse;
    try {
      deleteRequestResult = await deleteRequestEndpointController.handleDeleteRequest(deleteMatchMaking);
    } catch (e) {
    }

    // Should be true
    expect(deleteRequestResult.successful).toBeTruthy();

    // delete user
    deleteProfileRequest = new DeleteProfileRequest(loginResponse.session.session_id, user);

    let profileDeleteRequestResult: DeleteProfileResponse;
    try {
      profileDeleteRequestResult = await profileDeleteEndpointController.handleProfileDeleteRequest(deleteProfileRequest);
    }
    catch (e) {
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
