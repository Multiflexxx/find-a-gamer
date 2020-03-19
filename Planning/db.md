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