# Communication between Back- and Frontend

|Action|Request Type|Request Parameter|Response Parameter|
|---:|---:|---|---|
|Landing Page|POST|<code>string: sessionID</code>|<code>bool: loggedIn</code> <br> <code>string: welcomeText</code><br><code>array: popularGames</code><br><code>object: user</code>|
|Profile|POST|<code>string: sessionID</code>|<code>object: user</code><br><code>array: matchHistory</code>
|Registration|POST|<code>object: registration</code>|<code>bool: successful</code><br><code>string: sessionID</code>
|Login|POST|<code>string: email</code><br><code>string: pwdHash</code><br><code>bool: stayLoggedIn</code>|<code>string: sessionID</code><br><code>bool: stayLoggedIn</code>
|Matchmaking- <br> Request|POST|tbd|tbd
|Match-Found- <br> Request|POST|<code>string: sessionID</code>|<code>bool: matchFound</code><br>tbd
|Edit Profile|POST|<code>object: user</code><br><code>string: sessionID</code>|<code>bool: successful</code><br><code>object: user</code>

## Object Definitions
### User
```javascript
class User {
  "user_id": 12,
  "email": "mail@mail.com",
  "password_hash": "123456",
  "nickname": "GamerName",
  "discord_tag": "User#1234",
  "profile_picture": "/link/to/image.png",
  "cake_day": "01.12.2020",
  "birthdate": "01.01.1970",
  "biography": "I am a gamer",
  "region": "Europe"
}
```

### Registration
```javascript
class Registration {
  "email": "mail@mail.com",
  "password_hash": "123456",
  "nickname": "GamerName",
  "discord_tag": "User#1234",
  "birthdate": "01.01.1970",
  "region": "Europe",
  "languages": [{language}, {language}],
  "games": [{game}, {game}]
}
```

### Language
```javascript
class Language {
  "language_id": 15,
  "name": "German",
  "language_code": "DE"
}
```

### Game
```javascript
class Game {
  "game_id": 12,
  "name": "Apex Legends",
  "cover_link": "https://url",
  "game_description": "Battle Royale shooter",
  "publisher": "EA",
  "published": "01.01.1970"
}
```

### MatchRequest
```javascript
class MatchRequest {

}
```

### Match
```javascript
class Match {

}
```

