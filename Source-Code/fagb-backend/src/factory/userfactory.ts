import { User } from '../data_objects/user';
import { Registration } from '../data_objects/registration';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserLanguagePair } from '../data_objects/userlanguagepair';
import { UserGamePair } from '../data_objects/usergamepair';
import { GameFactory } from './gamefactory';
import { LanguageFactory } from './languagefactory';
import { RegionFactory } from './regionfactory';
import { Region } from 'src/data_objects/region';
import { UserGamePairFactory } from './usergamepairfactory';
import { Game } from 'src/data_objects/game';
import { UserLanguagePairFactory } from './userlanguagepairfactory';
import { Language } from 'src/data_objects/language';

export class UserFactory {
    public static async createUser(registration: Registration): Promise<User> {
        return new Promise(async function(resolve, reject) {
            // Create User
            let query = QueryBuilder.createUser(registration);
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                // Alles gut
            }, function(callbackValue) {
                // nix gut
                console.error(callbackValue);
                reject(callbackValue);
            });

            // Get created User
            let result;
            await UserFactory.getUserByEmail(registration.email).then(function(callbackValue) {
                result = callbackValue;
                console.log(result);
                console.log(callbackValue);
            }, function(callbackValue) {
                console.error("UserFactory getUserByEmail(): ")
                console.error(callbackValue);
                reject(callbackValue);
            });
            
            if(!result) {
                return;
            }
            console.log("Result in User Factory");
            console.log(result);
            let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result. profile_picture, result.cake_day, result.birthdate, result.biography);

            // // Get Region
            // result = null;
            // await RegionFactory.getRegionById(result.region_id).then(function(callbackValue) {
            //     result = callbackValue;
            // }, function(callbackValue) {
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // });

            // if(!result) {
            //     return;
            // }

            // user.region = new Region(result.region_id, result.name);
            
            // Create User Game Pairs
            await UserGamePairFactory.createUserGamePairs(user, registration.games).then(function(callbackValue) {
                // Successfully created User Game Pairs
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });

            // Get Games for User
            await GameFactory.getGamesForUser(user).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });
            user.games = [];
            result.forEach(game => {
                user.games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
            });

            // Create User Language Pairs
            await UserLanguagePairFactory.createUserLanguagePairs(user, registration.languages).then(function(callbackValue) {
                // Successfully created User Language Pairs
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            })

            // Get Languages for User
            await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });

            user.languages = [];
            result.forEach(language => {
                user.languages.push(new Language(language.language_id, language.name, language.language_code))
            });

            resolve(user);
        });
    };

    // private static getLanguagePairs(user_id: number): UserLanguagePair[] {
    //     return null;
    // }

    // private static getGamePairs(user_id: number): UserGamePair[] {
    //     return null;
    // }

    public static async getUserByEmail(email: string): Promise<User> {
        return new Promise(async function(resolve, reject) {
            let dbConnection = new ConnectToDatabaseService();
            let query = QueryBuilder.getUserByEmail(email);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error("");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!result) {
                reject("No User with that Email");
                return;
            }
    
            let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);

            await RegionFactory.getRegionById(result.region_id).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error("Failed to get Region in UserFactory getUserByEmail");
                console.error(callbackValue);
            })
            user.region = new Region(result.region_id, result.name);
            
            // Get Games for user
            let games;
            await GameFactory.getGamesForUser(user).then(function(callbackValue) {
                games = callbackValue;
                console.log(user.games);
            }, function(callbackValue) {
                console.error("GameFactory getGamesForUser: Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!games) {
                return false;
            }

            user.games = games;

            // Get Languages for User
            await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
                user.languages = callbackValue;
            }, function(callbackValue) {
                console.error("LanguageFactory getLanguagesForUser: Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            })
            resolve(user);
        });

    }

    public static async getUserBySessionID(session_id: string): Promise<User> {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.getUserBySessionID(session_id);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error("UserFactory getUserBySessionID(): Couldn't get User");
                console.error(callbackValue);
                reject(callbackValue);
            });

            // console.log(result);

            if(!result) {
                reject("No User with that Session");
                return;
            }

            let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);
            
            await RegionFactory.getRegionById(result.region_id).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error("Failed to get Region in UserFactory getUserByEmail");
                console.error(callbackValue);
            })
            user.region = new Region(result.region_id, result.name);
            
            // Get Games for user
            let games;
            await GameFactory.getGamesForUser(user).then(function(callbackValue) {
                games = callbackValue;
            }, function(callbackValue) {
                console.error("GameFactory getGamesForUser: Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!games) {
                return false;
            }

            user.games = games;

            // Get Languages for User
            await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
                user.languages = callbackValue;
            }, function(callbackValue) {
                console.error("LanguageFactory getLanguagesForUser: Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            })
            resolve(user);
        });
    }

    public static async updateUser(user: User): Promise<User> {
        return new Promise(async function(resolve, reject) {
            // Get Query for updating user
            let newGames: Game[];
            newGames = user.games;
            let newLanguages : Language[];
            newLanguages = user.languages;

            let query = QueryBuilder.updateUser(user);

            // Update User
            let successful = false;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("UserFactory updateUser(): Couldn't update user");
                console.error(callbackValue);
            });

            // If successful, return updated User Object
            if(!successful) {
                reject("UserFactory updateUser(): Couldn't update user");
                return;
            }

            


            let newUser = null;
            await UserFactory.getUserByEmail(user.email).then(function(callbackValue) {
                newUser = callbackValue;
                console.log("New User");
                console.log(newUser);
            }, function(callbackValue) {
                console.error("UserFactory updateUser(): Failed to get User");
                console.error(callbackValue);
            });

            if(!newUser) {
                reject("UserFactory updateUser(): No user with that email")
                return;
            }

            // Update Games for User
            let result;
            await GameFactory.updateGamesForUser(newUser, newGames).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error("UserFactory updateUser(): Failed to get Updated Games for User");
                console.error(callbackValue);
            });

            if(!result) {
                reject(false);
                return;
            }
            
            newUser.games = result;
            // successful = false;
            // await UserGamePairFactory.deleteUserGamePairsByUser(newUser).then(function(callbackValue) {
            //     successful = true;
            // }, function(callbackValue) {
            //     console.error("UserFactory updateUser(): Couldn't delete UserGamePairs");
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // })

            // if(!successful) {
            //     return;
            // }

            // // Create new UserGamePairs
            // successful = false;
            // await UserGamePairFactory.createUserGamePairs(newUser, user.games).then(function(callbackValue){
            //     successful = true;
            // }, function(callbackValue) {
            //     console.error("UserFactory updateUser(): Couldn't create UserGamePairs");
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // });

            // if(!successful) {
            //     return;
            // }

            // // Get newly created games for user
            // let result = null;
            // await GameFactory.getGamesForUser(newUser).then(function(callbackValue) {
            //     result = callbackValue;
            // }, function(callbackValue) {
            //     console.error("UserFactory updateUser(): Couldn't get Games for user");
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // });
            
            // if(!result) {
            //     return;
            // }

            // newUser.games = result;

            result = null;
            await LanguageFactory.updateLanguagesForUser(newUser, newLanguages).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error("UserFactory updateUser(): Failed to get Updated Languages for User");
                console.error(callbackValue);
            });

            if(!result) {
                reject(false);
                return;
            }

            newUser.languages = result;
            
            // // Delete old UserLanguagePairs
            // successful = false;
            // await UserLanguagePairFactory.deleteUserLanguagePairs(user).then(function(callbackValue) {
            //     successful = true;
            // }, function(callbackValue) {
            //     console.error("UserFactory updateUser(): Couldn't delete UserLanguagePairs");
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // })

            // if(!successful) {
            //     return;
            // }

            // // Create new UserLanguagePairs
            // successful = false;
            // await UserLanguagePairFactory.createUserLanguagePairs(newUser, user.languages).then(function(callbackValue){
            //     successful = true;
            // }, function(callbackValue) {
            //     console.error("UserFactory updateUser(): Couldn't create UserLanguagePairs");
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // });

            // if(!successful) {
            //     return;
            // }

            // // Get newly created UserLanguagePairs
            // result = null;
            // await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
            //     result = callbackValue;
            // }, function(callbackValue) {
            //     console.error("UserFactory updateUser(): Couldn't get Languages for user");
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // });
            
            resolve(newUser);
        });
    }

    public static async deleteUser(user: User): Promise <User> {
        return new Promise(async function(resolve, reject) {
            // Delete UserGamePair
            let query = QueryBuilder.deleteUserGamePairsByUser(user);
            let successful= false;

            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("UserFactory deleteUser(): Couldn't delete User Game Pair");
                console.error(callbackValue);
                reject(callbackValue);
            });
            
            if (!successful) {
                reject("UserFactory deleteUser(): couldn't delete user game pair");
                return;
            } 

            // Delete UserLanguagePair
            query = QueryBuilder.deleteUserLanguagePairsByUser(user);
            
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("UserFactory deleteUser(): Couldn't delete user language pair");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                reject("UserFactory deleteUser(): couldn't delete user language pair");
                return;
            } 

            query = QueryBuilder.deleteUser(user);
            
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("UserFactory deleteUser(): Couldn't delete user");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                reject("UserFactory deleteUser(): couldn't delete user");
                return;
            }
            
            resolve(user);
        });
    }
}

