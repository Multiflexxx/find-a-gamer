import { Controller, Body, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { EditProfileRequest } from '../../data_objects/editprofilerequest';
import { EditProfileResponse } from '../../data_objects/editprofileresponse';
import { SessionFactory } from '../../factory/sessionfactory';
import { UserFactory } from '../../factory/userfactory';
import { User } from '../../data_objects/user';
import { Region } from '../../data_objects/region';
import { Game } from '../../data_objects/game';
import { Language } from '../../data_objects/language';
import { QueryBuilder } from '../../connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryObject } from '../../data_objects/queryobject';
import { UserGamePairFactory } from '../../factory/usergamepairfactory';
import { GameFactory } from '../../factory/gamefactory';
import { UserLanguagePair } from '../../data_objects/userlanguagepair';
import { UserLanguagePairFactory } from '../../factory/userlanguagepairfactory';
import { LanguageFactory } from '../../factory/languagefactory';
import { RegionFactory } from '../../factory/regionfactory';
import { Session } from '../../data_objects/session';
import { PublicUser } from '../../data_objects/publicuser';

@Controller('profileupdateendpoint')
export class ProfileUpdateEndpointController {

    @Post()
    public async handleProfileUpdateRequest(@Body() editProfileRequest: EditProfileRequest): Promise<EditProfileResponse> {

        const user: User = await UserFactory.getUserBySessionID(editProfileRequest.session_id);
        if(!user) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Not authorized to change this user'
            }, HttpStatus.UNAUTHORIZED);
        }

        if(editProfileRequest.oPassword != null && editProfileRequest.nPassword != null) {
            if(user.password_hash !== editProfileRequest.oPassword) {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: 'Wrong Password'
                }, HttpStatus.UNAUTHORIZED);
            }
        }

        if(!(await ProfileUpdateEndpointController.validateInput(editProfileRequest))) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Invalid Input'
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        const publicUser: PublicUser = await UserFactory.updateUser(editProfileRequest);
        if(!publicUser) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to update User'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new EditProfileResponse(true, publicUser);
    }

    private static async validateInput(editProfileRequest: EditProfileRequest): Promise<boolean> {
        if(editProfileRequest.publicUser != null) {
            // Validate Region
            const region: Region = await RegionFactory.getRegionById(editProfileRequest.publicUser.region.region_id);
            if(!region) {
                console.error('ProfileUpdateEndpointController validateInput(): Couldn\'t get region');
                return false;
            }

            // Validate Languages
            editProfileRequest.publicUser.languages.forEach(async lang => {
                const language: Language = await LanguageFactory.getLanguageById(lang.language_id);
                if(!language) {
                    console.error('ProfileUpdateEndpointController validateInput(): Couldn\'t get language');
                    return false;
                }
            });


            // Validate Games
            editProfileRequest.publicUser.games.forEach(async g => {
                const game: Game = await GameFactory.getGameById(g.game_id);
                if(!game) {
                    console.error('ProfileUpdateEndpointController validateInput(): Couldn\'t get game');
                    return false;
                }
            });

            if(editProfileRequest.publicUser.biography.length > 500) {
                console.error('ProfileUpdateEndpointController validateInput(): Biography exceeded maximum length');
                return false;
            }
        }
        return true;
    }
}
