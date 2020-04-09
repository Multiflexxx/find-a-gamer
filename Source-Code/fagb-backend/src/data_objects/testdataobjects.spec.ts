import { Test, TestingModule } from '@nestjs/testing';
import {Login} from './login';

describe('Check Login-object', () => {
    let loginPw: Login;
    let loginSession: Login;
    let loginSessionEmpty: Login;
    let loginNull: Login;

    loginPw = new Login(null, 'mail@mail.com', 'hash123', true);
    loginSession = new Login('session_id');
    loginSessionEmpty = new Login('');
    loginNull = new Login();

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