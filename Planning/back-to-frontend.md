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
    
}
```

### Registration
```javascript
class Registration {

}
```

### Game
```javascript
class Game {

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

