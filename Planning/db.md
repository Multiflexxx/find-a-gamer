# Database
## General Information
- MariaDB Database

## Entities
- User
- Game
- Region
- Language
- Session

## Table Definitions
### User
```sql
Create Table User (
    user_id int NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    nickname varchar(32) NOT NULL,
    discord_tag varchar(37) NOT NULL,
    profile_picture varchar(255),
    cake_day DATE NOT NULL,
    birthdate DATE NOT NULL,
    biography varchar(500),
    region_id int NOT NULL,
    Primary Key (user_id),
    Foreign Key (region_id) REFERENCES Region(region_id)
);
```

### Region
```sql
Create Table User (
    region_id int AUTO_INCREMENT,
    region_name varchar(30),
    Primary Key (region_id)
);
```

### Game
```sql
Create Table Game (
    game_id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    cover_link varchar(255),
    game_description varchar(500),
    publisher varchar(255),
    published DATE,
    Primary Key (game_id)
);
```

### Language
```sql
Create Table Language (
    language_id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    language_code varchar(10) NOT NULL,
    Primary Key (language_id)
);
```
### Session
```sql
Create Table Session(
    session_id binary(16) NOT NULL,
    user_id int NOT NULL,
    stay_logged_in BOOLEAN,
    expiration_date DATE,
    Primary Key (session_id),
    Foreign Key (user_id) REFERENCES User (user_id)
);
```


### User_Language_Pair
```sql
Create Table User_Language_Pair (
    pair_id int AUTO_INCREMENT NOT NULL,
    language_id int NOT NULL,
    user_id int NOT NULL,
    Primary Key(pair_id),
    Foreign Key(language_id) REFERENCES Language(language_id),
    Foreign Key(user_id) REFERENCES User(user_id)
);
```

### User_Game_Pair
```sql
Create Table User_Game_Pair (
    pair_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    game_id int NOT NULL,
    Foreign Key (user_id) REFERENCES User(user_id),
    Foreign Key (game_id) REFERENCES Game(game_id),
    Primary Key (pair_id)
);
```

### MatchMakingRequest
```sql
Create Table MatchMakingRequest(
    request_id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    game_id int NOT NULL,
    searching_for int NOT NULL,
    players_in_party int NOT NULL,
    casual tinyint NOT NULL,
    time_stamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    match_id binary(16) DEFAULT NULL,
    Primary Key (request_id),
    Foreign Key (user_id) References User(user_id),
    Foreign Key (game_id) References Game(game_id)  
);
```

### Discord_Info
```sql
Create Table Discord_Info(
    token binary(16) NOT NULL,
    username varchar(32) NOT NULL,
    avatar varchar(32),
    discriminator varchar(10),
    PRIMARY KEY (token)
);
```

###

## Own Functions:

### UUID_TO_BIN
This function converts a generated UUID with 36 characters length (like this <code>b9117c5e-8c9e-4e5e-be97-717677c8ecfd</code>) to a binary format to store on the database. Therefore it removes the dashes and unhexes the rest.

```sql
CREATE FUNCTION UUID_TO_BIN(_uuid BINARY(36))
    RETURNS BINARY(16)
        LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
        RETURN
            UNHEX(CONCAT(
                SUBSTR(_uuid, 15, 4),
                SUBSTR(_uuid, 10, 4),
                SUBSTR(_uuid,  1, 8),
                SUBSTR(_uuid, 20, 4),
                SUBSTR(_uuid, 25)
            ));
 ```

### Bin_TO_UUID
This function converts the 16 bytes binary value from the database to a 36 characters long UUID string with dashes. 

 ```sql   
CREATE FUNCTION BIN_TO_UUID(_bin BINARY(16))
    RETURNS BINARY(36)
        LANGUAGE SQL  DETERMINISTIC  CONTAINS SQL  SQL SECURITY INVOKER
        RETURN
            LCASE(CONCAT_WS('-',
                HEX(SUBSTR(_bin,  5, 4)),
                HEX(SUBSTR(_bin,  3, 2)),
                HEX(SUBSTR(_bin,  1, 2)),
                HEX(SUBSTR(_bin,  9, 2)),
                HEX(SUBSTR(_bin, 11))
            ));
```

For more information about the functions see this website: [GUID/UUID Performance](https://mariadb.com/kb/en/guiduuid-performance/).