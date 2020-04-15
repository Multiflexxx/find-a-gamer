import { Controller, Get, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { Login } from '../../data_objects/login';
import { UserFactory } from '../../factory/userfactory';
import { LoginResponse } from '../../data_objects/loginresponse';
import { User } from '../../data_objects/user';
import { SessionFactory } from '../../factory/sessionfactory';
import { Session } from '../../data_objects/session';

@Controller('loginendpoint')
export class LoginendpointController {
    @Post()
    async handleLogin(@Body() login: Login): Promise<LoginResponse> {

        // Check for validity?
        // Get User via Session OR email & password_hash
        if (login.email && login.password_hash) {
            // Get User by email and password
            let user: User = await UserFactory.getUserByEmail(login.email);
            if (!user) {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'No user with that Email',
                }, HttpStatus.UNAUTHORIZED)
            }

            // Check if password_hash is the same
            if (user.password_hash != login.password_hash) {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Email and Password don\'t match',
                }, HttpStatus.UNAUTHORIZED)
            }

            // Delete old user session
            let successful: boolean = await SessionFactory.deleteSessionByUser(user);
            if (!successful) {
                console.error("LoginEndpointController handleLogin(): Couldn't delete old session");
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Couldn't delete old session",
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // Create new Session for User
            let session: Session = await SessionFactory.createSessionForUser(user, login.stay_logged_in);
            if (!session) {
                console.error("LoginEndpointController handleLogin(): Couldn't create new session");
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: "Couldn't create Session"
                }, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            return new LoginResponse(true, session, UserFactory.userToPublicUser(user));

        } else if (login.session_id) {
            // Get User by session_id
            let user: User = await UserFactory.getUserBySessionID(login.session_id);
            if (!user) {
                console.error("LoginEndpoint: No user with that SessionID");
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Invalid Session',
                }, HttpStatus.UNAUTHORIZED)
            }

            // Get Session
            let session: Session = await SessionFactory.getSessionBySessionId(login.session_id);
            if (!session) {
                throw new HttpException({
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Failed to get Session for session_id',
                }, HttpStatus.INTERNAL_SERVER_ERROR)
            }

            return new LoginResponse(true, session, UserFactory.userToPublicUser(user));
        }
    }
}
