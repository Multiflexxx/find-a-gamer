import { Controller, Get, Body } from '@nestjs/common';
import { Login } from 'src/data_objects/login';
import { UserFactory } from 'src/factory/userfactory';
import { LoginResponse } from 'src/data_objects/loginresponse';
import { User } from 'src/data_objects/user';
import { SessionFactory } from 'src/factory/sessionfactory';
import { Session } from 'src/data_objects/session';

@Controller('loginendpoint')
export class LoginendpointController {
    @Get() 
    async handleLogin(@Body() login: Login) {
        
        login = new Login(
            undefined,
            "ed008579-c4f7-4a6e-93bd-0caadd2a4097",
            "test123498"
        );

        
        // Check for validity?
        let loginResponse = null;
        // Get User via Session OR email & password_hash
        if(login.email && login.password_hash) {
            // Get User by email and password
            let result = null;
            await UserFactory.getUserByEmail(login.email).then(function(callbackValue) {
                // Got User
                result = callbackValue;
            }, function(callbackValue) {
                // No user with that Email
                console.error("LoginEndpoint: No user with that Email");
                console.error(callbackValue);
            });
            
            if(!result) {
                loginResponse = new LoginResponse(false);
                return loginResponse
            }

            let user = result;

            // Check if password_hash is the same
            if(user.password_hash != login.password_hash) {
                loginResponse = new LoginResponse(false);
                return loginResponse
            }

            // Delete old user session
            let successful = false;
            SessionFactory.deleteSessionByUser(user).then(function(callbackValue) {
                // Successfully deleted Session
                successful = true;
            }, function(callbackValue) {
                console.error("LoginEndpoint handleLogin: Failed to delete old user session");
                console.error(callbackValue);
            });

            // Create new Session for User
            let session;
            await SessionFactory.createSessionForUser(user, login.stay_logged_in).then(function(callbackValue) {
                session = callbackValue;
            }, function(callbackValue) {
                console.error("LoginEndpoint handleLogin(): Couldn't create session");
                console.error(callbackValue);
            });
            

            loginResponse = new LoginResponse(true, session, user);
            console.log(loginResponse);
            return loginResponse;
            
        } else if(login.session_id) {
            // Get User by session_id
            let user;
            await UserFactory.getUserBySessionID(login.session_id).then(function(callbackValue) {
                // Got User
                user = callbackValue;
            }, function(callbackValue) {
                // No user with that SessionID
                console.error("LoginEndpoint: No user with that SessionID");
                console.error(callbackValue);
            });
            
            if(!user) {
                loginResponse = new LoginResponse(false);
                return loginResponse
            }

            // Get Session
            let session;
            await SessionFactory.getSessionBySessionId(login.session_id).then(function(callbackValue) {
                session = callbackValue;
            }, function(callbackValue) {
                console.error("LoginEndpoint handleLogin(): Couldn't get Session");
                console.error(callbackValue);
            })
            
            loginResponse = new LoginResponse(true, session, user);
            return loginResponse;
        }
    }
}