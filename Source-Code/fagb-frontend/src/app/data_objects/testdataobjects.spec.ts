import { Test, TestingModule } from '@nestjs/testing';
import { Login } from './login';
import { Session } from './session';
import { Language } from './language';
import { Game } from './game';
import { UserGamePair } from './usergamepair';
import { GameResponse } from './gameresponse';
import { Region } from './region';
import { Registration } from './registration';
import { Response } from './response';
import { UserLanguagePair } from './userlanguagepair';
import { RegistrationResponse } from './registrationresponse';
import { User } from './user';
import { PublicUser } from './publicuser';
import { QueryObject } from './queryobject';
import { NotifyMatch } from './notifymatch';
import { LoginResponse } from './loginresponse';

// unit tests done for:
// login
// session
// language
// game
// usergamepair
// gameresponse
// region
// registration
// response
// registrationresponse
// userlanguagepair
// user
// publicuser
// queryobject
// notifymatch
// login response

// todo:
// DeleteMatchMakingRequest
// DeleteProfileRequest
// DeleteProfileResponse
// EditProfileRequest
// EditProfileResponse
// MatchMakingRequest
// MatchMakingResponse

describe('Check Login-object', () => {
    const loginPw: Login = new Login(null, 'mail@mail.com', 'hash123', true);
    const loginSession: Login = new Login('session_id');
    const loginSessionEmpty: Login = new Login('');
    const loginNull: Login = new Login();

    it('should be a full valid Login-object', () => {
        expect(loginPw.session_id).toBeNull();
        expect(loginPw.email).toEqual('mail@mail.com');
        expect(loginPw.password_hash).toEqual('hash123');
        expect(loginPw.stay_logged_in).toBeTruthy();
    });

    it('should be a Login-object just with session', () => {
        expect(loginSession.session_id).toEqual('session_id');
        expect(loginSession.email).toBeNull();
        expect(loginSession.password_hash).toBeNull();
        expect(loginSession.stay_logged_in).toBeFalsy();
    });

    it('should be a Login-object with an empty session', () => {
        expect(loginSessionEmpty.session_id).toEqual('x');
        expect(loginSessionEmpty.email).toBeNull();
        expect(loginSessionEmpty.password_hash).toBeNull();
        expect(loginSessionEmpty.stay_logged_in).toBeFalsy();
    });

    it('should be a Login-object with all null', () => {
        expect(loginNull.session_id).toBeNull();
        expect(loginNull.email).toBeNull();
        expect(loginNull.password_hash).toBeNull();
        expect(loginNull.stay_logged_in).toBeFalsy();
    });
});

describe('Check Session-object', () => {

    const testDate: Date = new Date();
    const sessionWithDate: Session = new Session('session_id', 12, true, testDate);
    const sessionWithoutDate: Session = new Session('session_id_2', 13, true);

    it('should be a Session-object with expiration date', () => {
        expect(sessionWithDate.session_id).toEqual('session_id');
        expect(sessionWithDate.user_id).toEqual(12);
        expect(sessionWithDate.stay_logged_in).toBeTruthy();
        expect(sessionWithDate.expiration_date).toEqual(testDate);
    });

    it('should be a Session-object without expiration date', () => {
        expect(sessionWithoutDate.session_id).toEqual('session_id_2');
        expect(sessionWithoutDate.user_id).toEqual(13);
        expect(sessionWithoutDate.stay_logged_in).toBeTruthy();
        expect(sessionWithoutDate.expiration_date).toBeNull();
    });
});

describe('Check Language-object', () => {

    const languageFull: Language = new Language(1, 'German', 'DE');
    const languageName: Language = new Language(2, 'English');
    const languageCode: Language = new Language(3, null, 'US');

    it('should be a full Language-object', () => {
        expect(languageFull.language_id).toEqual(1);
        expect(languageFull.name).toEqual('German');
        expect(languageFull.language_code).toEqual('DE');
    });

    it('should be a Language-object with language name', () => {
        expect(languageName.language_id).toEqual(2);
        expect(languageName.name).toEqual('English');
        expect(languageName.language_code).toBeNull();
    });

    it('should be a Language-object with language name', () => {
        expect(languageCode.language_id).toEqual(3);
        expect(languageCode.name).toBeNull();
        expect(languageCode.language_code).toEqual('US');
    });
});

describe('Check Game-object', () => {

    const testDate: Date = new Date();
    const gameFull: Game = new Game(1, 'Minecraft', '/image/img.png', 'A lego like game.', 'Mojang', testDate);
    const gameNull: Game = new Game(2);

    it('should be a Game-object with all set', () => {
        expect(gameFull.game_id).toEqual(1);
        expect(gameFull.name).toEqual('Minecraft');
        expect(gameFull.cover_link).toEqual('/image/img.png');
        expect(gameFull.publisher).toEqual('Mojang');
        expect(gameFull.published).toEqual(testDate);
    });

    it('should be a Game-object with all null execpt id', () => {
        expect(gameNull.game_id).toEqual(2);
        expect(gameNull.name).toBeNull();
        expect(gameNull.cover_link).toBeNull();
        expect(gameNull.publisher).toBeNull();
        expect(gameNull.published).toBeNull();
    });
});

describe('Check UserGamePair-object', () => {

    const userGamePair: UserGamePair = new UserGamePair(2, 3, 4);

    it('should be a valid User-Game-Pair', () => {
        expect(userGamePair.pair_id).toEqual(2);
        expect(userGamePair.user_id).toEqual(3);
        expect(userGamePair.game_id).toEqual(4);
    });
});

describe('Check GameResponse-object', () => {
    const testGame: Game = new Game(12);
    const gameResponse: GameResponse = new GameResponse(testGame, 15);

    it('should be a valid GameResponse with game_id == 12', () => {
        expect(gameResponse.game).toBeDefined();
        expect(gameResponse.game.game_id).toEqual(12);
        expect(gameResponse.counter).toEqual(15);
    });
});

describe('Check Region-object', () => {
    const region: Region = new Region(3, 'Asia');
    const regionNull: Region = new Region(4);

    it('should be a valid region', () => {
        expect(region.region_id).toEqual(3);
        expect(region.name).toEqual('Asia');
    });

    it('should be a region without name', () => {
        expect(regionNull.region_id).toEqual(4);
        expect(regionNull.name).toBeUndefined();
    });
});

describe('Check Registration-object', () => {
    const testDate: Date = new Date();
    const testRegion: Region = new Region(3, 'Asia');
    const testLanguages: Language[] = [new Language(1, 'German', 'DE'), new Language(2, 'English', 'US')];
    const testGames: Game[] = [new Game(2), new Game(3)];
    const registration: Registration = new Registration('mail@mail.com', 'hash123', 'nickname', 'nickname#1234', testDate, testRegion, testLanguages, testGames, '123456');

    it('should be a valid registration', () => {
        expect(registration.email).toEqual('mail@mail.com');
        expect(registration.password_hash).toEqual('hash123');
        expect(registration.nickname).toEqual('nickname');
        expect(registration.birthdate).toEqual(testDate);
        expect(registration.region).toEqual(testRegion);
        expect(registration.languages).toHaveLength(2);
        expect(registration.languages[0].language_id).toEqual(1);
        expect(registration.games).toHaveLength(2);
        expect(registration.games[0].game_id).toEqual(2);
        expect(registration.discordToken).toEqual('123456');
    });
});

describe('Check general Response-object', () => {
    const response: Response = new Response(true, 'message');

    it('should be a valid response', () => {
        expect(response.successful).toBeTruthy();
        expect(response.message).toEqual('message');
    });
});

describe('Check UserLanguagePair-object', () => {
    const userLanguagePair: UserLanguagePair = new UserLanguagePair(5, 6, 3);

    it('should be a valid User-Language-Pair', () => {
        expect(userLanguagePair.pair_id).toEqual(5);
        expect(userLanguagePair.user_id).toEqual(6);
        expect(userLanguagePair.language_id).toEqual(3);
    });
});

describe('Check RegistrationResponse-object', () => {
    const testDate: Date = new Date();
    const testSession: Session = new Session('session_id', 12, true, testDate);
    const registrationResponse: RegistrationResponse = new RegistrationResponse(true, testSession, 'message');

    it('should be a valid registration response', () => {
        expect(registrationResponse.successful).toBeTruthy();
        expect(registrationResponse.session_object).toEqual(testSession);
        expect(registrationResponse.session_object.expiration_date).toEqual(testDate);
        expect(registrationResponse.message).toEqual('message');
    });
});

describe('Check User-object', () => {

    const cakeDate: Date = new Date();
    const birthDate: Date = new Date();
    const testRegion: Region = new Region(3, 'Asia');
    const testLanguages: Language[] = [new Language(1, 'German', 'DE'), new Language(2, 'English', 'US')];
    const testGames: Game[] = [new Game(2), new Game(3)];

    const userFull: User = new User(12, 'mail@mail.com', 'hash123', 'nickname', 'nickname#1234', '/image/img.png', cakeDate, birthDate, 'Bio', testRegion, testGames, testLanguages);
    const user: User = new User(13, 'mail@mail1.com', 'hash1234', 'nickname', 'nickname#1234', '/image/img.png', cakeDate, birthDate, 'Bio');

    it('should be a full valid user', () => {
        expect(userFull).toBeDefined();
        expect(userFull.user_id).toEqual(12);
        expect(userFull.email).toEqual('mail@mail.com');
        expect(userFull.password_hash).toEqual('hash123');
        expect(userFull.nickname).toEqual('nickname');
        expect(userFull.discord_tag).toEqual('nickname#1234');
        expect(userFull.profile_picture).toEqual('/image/img.png');
        expect(userFull.cake_day).toEqual(cakeDate);
        expect(userFull.birthdate).toEqual(birthDate);
        expect(userFull.biography).toEqual('Bio');
        expect(userFull.region).toEqual(testRegion);
        expect(userFull.games).toEqual(testGames);
        expect(userFull.languages).toEqual(testLanguages);
    });

    it('should be a user without languages and games', () => {
        expect(user).toBeDefined();
        expect(user.user_id).toEqual(13);
        expect(user.email).toEqual('mail@mail1.com');
        expect(user.password_hash).toEqual('hash1234');
        expect(user.nickname).toEqual('nickname');
        expect(user.discord_tag).toEqual('nickname#1234');
        expect(user.profile_picture).toEqual('/image/img.png');
        expect(user.cake_day).toEqual(cakeDate);
        expect(user.birthdate).toEqual(birthDate);
        expect(user.biography).toEqual('Bio');
        expect(user.region).toBeNull();
        expect(user.games).toBeNull();
        expect(user.languages).toBeNull();
    });
});

describe('Check PublicUser-object', () => {

    const cakeDate: Date = new Date();
    const testRegion: Region = new Region(3, 'Asia');
    const testLanguages: Language[] = [new Language(1, 'German', 'DE'), new Language(2, 'English', 'US')];
    const testGames: Game[] = [new Game(2), new Game(3)];

    const userFull: PublicUser = new PublicUser(12, 'nickname', 'nickname#1234', cakeDate, testRegion, testGames, testLanguages, '/image/img.png', 'Bio');
    const user: PublicUser = new PublicUser(12, 'nickname', 'nickname#1234', cakeDate, testRegion, testGames, testLanguages);

    it('should be a full valid publicuser', () => {
        expect(userFull).toBeDefined();
        expect(userFull.user_id).toEqual(12);
        expect(userFull.nickname).toEqual('nickname');
        expect(userFull.discord_tag).toEqual('nickname#1234');
        expect(userFull.profile_picture).toEqual('/image/img.png');
        expect(userFull.cake_day).toEqual(cakeDate);
        expect(userFull.biography).toEqual('Bio');
        expect(userFull.region).toEqual(testRegion);
        expect(userFull.games).toEqual(testGames);
        expect(userFull.languages).toEqual(testLanguages);
    });

    it('should be a publicuser without bio and profile pic', () => {
        expect(user).toBeDefined();
        expect(user.user_id).toEqual(12);
        expect(user.nickname).toEqual('nickname');
        expect(user.discord_tag).toEqual('nickname#1234');
        expect(user.profile_picture).toBeNull();
        expect(user.cake_day).toEqual(cakeDate);
        expect(user.biography).toEqual('');
        expect(user.region).toEqual(testRegion);
        expect(user.games).toEqual(testGames);
        expect(user.languages).toEqual(testLanguages);
    });
});

describe('Check Query-object', () => {

    const queryobjectWithoutParam: QueryObject = new QueryObject('SELECT * FROM database;');
    const queryobjectWithParam: QueryObject = new QueryObject('SELECT * FROM database;', ['Param1', 'Param2']);

    it('should be a query-object without parameter', () => {
        expect(queryobjectWithoutParam.query).toEqual('SELECT * FROM database;');
        expect(queryobjectWithoutParam.parameter).toBeUndefined();
        expect(queryobjectWithoutParam.createQueryObject().sql).toEqual('SELECT * FROM database;');
        expect(queryobjectWithoutParam.createQueryObject().values).toBeUndefined();
    });

    it('should be a query-object with parameter', () => {
        expect(queryobjectWithParam.query).toEqual('SELECT * FROM database;');
        expect(queryobjectWithParam.parameter[0]).toEqual('Param1');
        expect(queryobjectWithParam.createQueryObject().sql).toEqual('SELECT * FROM database;');
        expect(queryobjectWithParam.createQueryObject().values[1]).toEqual('Param2');
    });
});

describe('Check NotifyMatch-object', () => {

    const notifyMatch: NotifyMatch = new NotifyMatch(5);

    it('should be a notifymatch-object', () => {
        expect(notifyMatch.request_id).toEqual(5);
    });
});

describe('Check LoginResponse-object', () => {

    const cakeDate: Date = new Date();
    const testRegion: Region = new Region(3, 'Asia');
    const testLanguages: Language[] = [new Language(1, 'German', 'DE'), new Language(2, 'English', 'US')];
    const testGames: Game[] = [new Game(2), new Game(3)];
    const testSession: Session = new Session('session_id', 5, false);
    const testUser: PublicUser = new PublicUser(12, 'nickname', 'nickname#1234', cakeDate, testRegion, testGames, testLanguages);

    const loginResponseFull: LoginResponse = new LoginResponse(true, testSession, testUser);
    const loginResponse: LoginResponse = new LoginResponse(true);

    it('should be a full loginresponse-object', () => {
        expect(loginResponseFull.successful).toBeTruthy();
        expect(loginResponseFull.session).toEqual(testSession);
        expect(loginResponseFull.user).toEqual(testUser);
    });

    it('should be a loginresponse-object', () => {
        expect(loginResponse.successful).toBeTruthy();
    });
});
