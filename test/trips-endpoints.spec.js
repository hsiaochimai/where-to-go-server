const passport = require("passport");
const { setKnexInstance } = require("../src/auth/strategies");
const app = require("../src/app");
const { expect, assert } = require("chai");
const {
  makeUsersArray,
  makeTripsArray,
  makePlacesArray
} = require("./trips.fixture");
const { TEST_DB_URL } = require("../src/config");
const TripsService = require("../src/trips/trips-service");
const knex = require("knex");
let db;
let authToken;
let userId;
const doLogin = () =>
  supertest(app)
    .post("/api/auth/login")

    // method: 'POST',
    .send({
      email: "demo@demo.com",
      password: "demo"
    })
    .set("Accept", "application/json")
    .expect("Content-Type", /json/)
    .then(r => {
      authToken = r.body.authToken;
      userId = r.body.user.id;
    });

describe("Trips Endpoints", function() {
  before(async () => {
    db = knex({
      client: "pg",
      connection: TEST_DB_URL
    });
    app.set("db", db);
    await doLogin();
  });
  after(async () => {
    await db.destroy();
    console.log("server closed");
  });
  before("clean the table", () =>
    db.raw("TRUNCATE places, trips, users RESTART IDENTITY CASCADE")
  );

  describe(`GET/api/trips`, async () => {
    context(`given no trips`, () => {
      it(`responds with 200 and an empty list`, async () => {
        return supertest(app)
          .get("/api/trips")
          .set({ Authorization: `Bearer ${authToken}` })
          .expect(200, {
            data: []
          });
      });
    });
    context(`Given there are trips in the database`, async () => {
      const testUsers = makeUsersArray();
      const testTrips = makeTripsArray();
      const testPlaces = makePlacesArray();

      beforeEach("insert trips", async () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("trips").insert(testTrips);
          })
          .then(() => {
            return db.into("places").insert(testPlaces);
          });
      });
      afterEach("clean the table", async  () =>
       await db.raw("TRUNCATE places, trips, users RESTART IDENTITY CASCADE")
      );
      it(`get /api/trips responds with 200 with trips for the user that is logged in`, () => {
        return supertest(app)
          .get("/api/trips")
          .set({ Authorization: `Bearer ${authToken}` })
          .expect(200)
          .then(response => {
            const { data } = response.body;
            data.forEach((i, index) => {
              if (index < data.length - 2) {
                expect(data[index].user_id === userId).to.be.true;
              }
            });
          });
      });

      it(` updates a trip`, async () => {
        let { places, ...trip } = await TripsService.getTripByID(db, 1);
        trip.name = "Portland";
        trip.numofdays = 3;
        const body = {
          trip
        };

        return supertest(app)
          .post(`/api/trips/create`)
          .send(body.trip)
          .set({ Authorization: `Bearer ${authToken}` })
          .then(r => JSON.parse(r.text))
          .then(async res => {
            "id name numofdays user_id completed"
              .split(" ")
              .forEach(fieldName => {
                let v = res[fieldName];
                let v2 = trip[fieldName];
                expect(v.toString()).to.equal(v2.toString());
              });
          });
      });
      it("Deletes a trip", async () => {
        const idToRemove = 2;

        return supertest(app)
          .delete(`/api/trips/${idToRemove}`)
          .set({ Authorization: `Bearer ${authToken}` })
          .expect(204)
          .then(
            supertest(app)
              .get(`/api/trips/${idToRemove}`)
              .expect(404)
          )

      });
      it("Creates a trip", async () => {
       
        let trip= 
       { id:-1,
        name : "Richmond",
        numofdays: 3,
        user_id : 1,
        completed: false
        
        }
        const body = {
          trip
        };
        console.log(`hello`,trip)
        return supertest(app)
          .post(`/api/trips/create`)
          .set({ Authorization: `Bearer ${authToken}` })
          .send(body.trip)
          .then(r => {console.log(r.text)
          })
          .then(async res => {
            "id name numofdays user_id completed"
              .split(" ")
              .forEach(fieldName => {
                let v = res[fieldName];
                let v2 = trip[fieldName];
                expect(v.toString()).to.equal(v2.toString());
              });
          });
      });
    });
  });
});
