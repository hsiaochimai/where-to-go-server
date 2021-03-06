CREATE TABLE users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password VARCHAR NOT NULL
);
CREATE TABLE trips (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
   numOfDays int NOT NULL,
    user_id int REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    completed boolean NOT NULL
);
CREATE TABLE places (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  transportation TEXT NOT NULL,
  notes TEXT NOT NULL,
  visited boolean NOT NULL,
    trip_id int REFERENCES trips(id) ON DELETE CASCADE NOT NULL
);