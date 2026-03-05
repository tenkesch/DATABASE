CREATE DATABASE notes_app;

USE notes_app;

CREATE TABLE notes (
    id integer PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    contents TEXT NOT NULL,
    created TIMESTAMP NOT NULL DEFAULT NOW(),
);

CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100)
);

INSERT INTO
    notes (title, contents)
VALUES
    ('My first note', 'A note abt something'),
    ('Ny second note', 'Another note about something');