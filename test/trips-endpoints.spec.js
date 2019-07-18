const passport = require('passport');
const { setKnexInstance } = require('../src/auth/strategies')
const app = require("../src/app");
const { expect, assert } = require("chai");
const {makeUsersArray, makeTripsArray, makePlacesArray}= require('./trips.fixture')
const {TEST_DB_URL}= require('../src/config')
const knex =require('knex')
let db 
let authToken 
let userId
const doLogin = () => supertest(app)
  .post(
    '/api/auth/login')

  // method: 'POST',
  .send({
    email: 'demo@demo.com',
    password: 'demo',
  })
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .then(r => {
    authToken = r.body.authToken
    userId=r.body.user.id
  })

  describe("Trips Endpoints", function (){
    before(async () => {
        db =  knex({
            client: "pg",
            connection: TEST_DB_URL
          });
        app.set("db", db);
        await doLogin()
      })
      after(async () => {
        await db.destroy();
        console.log("server closed");
      });
      before("clean the table", () => db.raw('TRUNCATE places, trips, users RESTART IDENTITY CASCADE'));

      describe(`GET/api/trips`, async ()=>{
          context(`given no trips`,()=>{
            it(`responds with 200 and an empty list`, async ()=>{
                return supertest(app)
                .get("/api/trips")
                .set({ Authorization: `Bearer ${authToken}` })
                .expect(200, {
                  data: [],
                  
                });
            });
          });
         context(`Given there are trips in the database`, async ()=>{
             const testUsers=makeUsersArray()
             const testTrips= makeTripsArray()
             const testPlaces= makePlacesArray()
             beforeEach("insert trips", () => {
                return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('trips')
                    .insert(testTrips)
                })
                .then(() => {
                    return db
                      .into('places')
                      .insert(testPlaces)
                  })
              });
              it(`get /api/trips responds with 200 and all of the trips and places for the user`, ()=>{
               
                return supertest(app)
                .get("/api/trips")
                .set({ Authorization: `Bearer ${authToken}` })
                .expect(200)
                .then(response=>{
                    const {data}=response.body
                    data.forEach((i, index)=>{
                       if(index < data.length - 2) {
                           expect(data[index].user_id=== userId).to.be
                           .true;
                       }
                    })
                })
              })
         })
          
      })
  })