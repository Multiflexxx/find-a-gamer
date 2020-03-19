# Database
## General Information
- MySQL Datenbank

## Entities
- User
- Game
- Queue

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
