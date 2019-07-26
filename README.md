# Lioness-Server

Where to go is a trip management tool where you can store places you want to go for upcoming trips!

## Server Hosted here:

https://enigmatic-spire-85974.herokuapp.com/

## API Documentation
## Routes


### login

POST '/api/auth/login' matches given credentials and provides a JWT Token.


### get trips and their associated places for the current user

`/api/trips`

### trip CRUD

`/api/trips/create`
POST creates a new trip 



`/api/trips/:id/`
POST updates a new trip
DELETE deletes a trip

### trip places CRUD

`/api/trip/upsertPlace`
POST id= -1 creates a new place
POST updates a new place


`/api/trip/deletePlace/:placeID`
DELETE deletes Place

## Technology Used

- Node.js
- Express
- Mocha
- Chai
- Postgres
- Passport
- Knex.js

## Security

Application uses JWT authentication
