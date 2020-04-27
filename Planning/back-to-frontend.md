# Communication between Back- and Frontend


|Action|Request Type|Request Parameter|Response Parameter|
|---:|---:|---|---|
|Delete Match-<br>Request|POST|<code>object: </code><br><code>DeleteMatchMakingRequest</code>|<code>object: DeleteMatchMakingResponse</code>|
|Discord<br>Callback|GET|<code>object: Request</code>|<code>void</code>|
|Discord<br>Data|POST|<code>object: DiscordInfoRequest</code>|<code>object: DiscordInformation</code>|
|Games Data|GET|| <code> object[]: GameResponse[]</code>|
|Language Data|GET|| <code> object[]: Language[]</code>|
|Login|POST|<code> object: Login</code>|<code> object: LoginResponse</code>|
|Match History|POST|<code> object: MatchHistoryRequest</code>|<code> object: MatchHistoryResponse</code>|
|MatchMaking- <br> Request|POST|<code> object: MatchMakingRequest</code>|<code> object: MatchMakingResponse</code>|
|Match Notify|POST|<code> object: NotifyMatch</code>|<code> object: MatchMakingResponse</code>|
|Delete Profil|POST|<code> object: DeleteProfileRequest</code>|<code> object: DeleteProfileResponse</code>|
|Update Profile|POST|<code> object: EditProfileRequest</code>|<code> object: EditProfileResponse</code>|
|Region Data|GET||<code> object[]: Region[]</code>|
|Register|POST|<code> object: Registration</code>|<code> object: Session</code>|

## Object Definitions
### DeleteMatchMakingRequest
```javascript
class DeleteMatchMakingRequest {
  "request_id": number,
  "session_id": string
}
```

### DeleteMatchMakingResponse
```javascript
class DeleteMatchMakingResponse {
  "successful": true,
  "request": DeleteMatchMakingRequest
}
```

### DeleteProfileRequest
```javascript
class DeleteProfileRequest {
  "publicUser": PublicUser,
  "session_id": string
}
```

### DeleteProfileResponse
```javascript
class DeleteProfileResponse {
  "successful": true,
  "publicUser": PublicUser
}
```

### DiscordInfoRequest
```javascript
class DiscordInfoRequest {
  "token": string
}
```

### DiscordInformation
```javascript
class DiscordInformation {
  "token": string,
  "userID": number,
  "username": string,
  "avater": string,
  "discriminator": string
}
```

### EditProfileRequest
```javascript
class EditProfileRequest {
  "session_id": string,
  "publicUser": PublicUser,
  "oPassword": string,
  "nPassword": string,
}
```

### EditProfileResponse
```javascript
class EditProfileResponse {
  "successful": true,
  "publicUser": PublicUser
}
```

### Game
```javascript
class Game {
  "game_id": number,
  "name": string,
  "cover_link": string,
  "game_description": string,
  "publisher": string,
  "published": Date,
}
```

### GameResponse
```javascript
class GameResponse {
  "game": Game,
  "counter": number,
}
```


### Language
```javascript
class Language {
  "language_id": number,
  "name": string,
  "language_code": string
}
```

### Login
```javascript
class Login{
  "seesion_id": string,
  "email": string,
  "password_hash": string,
  "stay_logged_in": boolean,
}
```

### LoginResponse
```javascript
class LoginResponse {
  "successful": boolean,
  "session": Session,
  "user": PublicUser,
}
```

### MatchHistoryRequest
```javascript
class MatchHistoryRequest {
  "session_id": string,
  "user_id": number,
  "first": number,
  "next": number,
}
```

### MatchHistoryResponse
```javascript
class MatchHistoryResponse {
  "totalAmount": number,
  "publicUser": PublicUser,
  "matchHistory": MatchMakingResponse[],
}
```

### MatchMakingRequest
```javascript
class MatchMakingRequest {
  "request_id": number,
  "session_id": string,
  "user_id": number,
  "game_id": number,
  "searching_for": number,
  "players_in_party": number,
  "casual": boolean,
  "time_stamp": Date,
  "match_id": string,
}
```

### MatchHistoryResponse
```javascript
class MatchHistoryResponse {
    "user": PublicUser,
    "game": Game,
    "matchMakingRequest": MatchMakingRequest,
    "matchedUsers": PublicUser[],
}
```

### NotifiyMatch
```javascript
class MatchMakingRequest {
  "request_id": number
}
```

### PublicUser
```javascript
class PublicUser {
  "user_id": number,
  "nickname": string,
  "discord_tag": string,
  "profile_picture": string,
  "cake_day": Date,
  "biography": string,
  "region": Region[],
  "games": Game[],
  "languages": Language[]
}
```

### QueryObject
```javascript
class QueryObject {
 "query": string,
 "parameter": any[]
}
```

### Region
```javascript
class Region {
 "region_id": number,
 "name": string
}
```

### Registration
```javascript
class Registration {
  "email": string,
  "password_hash": string,
  "nickname": string,
  "discord_tag": string,
  "birthdate": Date,
  "region": string,
  "languages": Language[],
  "games": Game[],
  "discordToken": string
}
```

### RegistrationResponse
```javascript
class RegistrationResponse {
 "successful": true,
 "session_object": Session,
 "message": string
}
```

### Response
```javascript
  class Response {
    "successful": true,
    "message": string
  }
```

### Session
```javascript
class Session {
  "session_id": number,
  "user_id": number,
  "expiration_date": Date,
  "stay_logged_in": true
}
```

### User
```javascript
class User {
  "user_id": number,
  "email": string,
  "password_hash": string,
  "nickname": string,
  "discord_tag": string,
  "profile_picture": string,
  "cake_day": Date,
  "birthdate": Date,
  "biography": string,
  "region": region,
  "games": Game[],
  "languages": Language[]
}
```

### UserGamePair
```javascript
class UserGamePair {
 "pair_id": number,
 "user_id": number,
 "game_id": number
}
```

### UserLanguagePair
```javascript
class UserLanguagePair {
 "pair_id": number,
 "user_id": number,
 "language_id": number
}

Info how to serve frontend with backend [here](https://docs.nestjs.com/recipes/serve-static)