import { Test, TestingModule } from '@nestjs/testing';
import { Login } from './login';
import { Session } from './session';
import { Language } from './language';
import { Game } from './game';
import { UserGamePair } from './usergamepair';

// unit tests done for:
// login
// session
// language
// game
// usergamepair


describe('Check Login-object', () => {
    let loginPw: Login = new Login(null, 'mail@mail.com', 'hash123', true);
    let loginSession: Login = new Login('session_id');
    let loginSessionEmpty: Login = new Login('');
    let loginNull: Login = new Login();

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
        expect(loginNull.session_id).toBeNull;
        expect(loginNull.email).toBeNull();
        expect(loginNull.password_hash).toBeNull();
        expect(loginNull.stay_logged_in).toBeFalsy();
    });
});

describe('Check Session-object', () => {

    let testDate: Date = new Date();
    let sessionWithDate: Session = new Session('session_id', 12, true, testDate);
    let sessionWithoutDate: Session = new Session('session_id_2', 13, true);

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

    let languageFull: Language = new Language(1, 'German', 'DE');
    let languageName: Language = new Language(2, 'English');
    let languageCode: Language = new Language(3, null, 'US');

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

    let testDate: Date = new Date;
    let gameFull: Game = new Game(1, 'Minecraft', '/image/img.png', 'A lego like game.', 'Mojang', testDate);
    let gameNull: Game = new Game(2);

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

    let userGamePair: UserGamePair = new UserGamePair(2, 3, 4);

    it('should be a valid User-Game-Pair', () => {
        expect(userGamePair.pair_id).toEqual(2);
        expect(userGamePair.user_id).toEqual(3);
        expect(userGamePair.game_id).toEqual(4);
    });
});