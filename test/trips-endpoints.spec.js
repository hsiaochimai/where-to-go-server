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
const populateDb = async (db) =>{
  const testUsers = makeUsersArray();
  const testTrips = makeTripsArray();
  const testPlaces = makePlacesArray();
  await db.raw("TRUNCATE places, trips, users RESTART IDENTITY CASCADE")
  .then(()=>{
    console.log(`Truncated!`)
  })
 
   await db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("trips").insert(testTrips);
          })
          .then(() => {
            return db.into("places").insert(testPlaces);
          });
 
          await db.raw(`
          SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips)+1)
            FROM  trips
            `).then(()=>{
              console.log(`SEQ (trips) changed!`)
            })  
            await db.raw(`
            SELECT setval('places_id_seq', max(id))
            FROM  places
            `).then(()=>{
              console.log(`SEQ (places) changed!`)
            })            


}
const doLogin = () =>
  supertest(app)
    .post("/api/auth/login")
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
  before("clean the table", async () =>
    await db.raw("TRUNCATE places, trips, users RESTART IDENTITY CASCADE")
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
 
      beforeEach("insert trips", async () => {
        return await populateDb(db)
        
      })
    
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
        await populateDb(db)

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
        return supertest(app)
          .post(`/api/trips/create`)
          .set({ Authorization: `Bearer ${authToken}` })
          .send(body.trip)
          .then(r => JSON.parse(r.text)
          )
          .then(async res => {
            "name numofdays user_id completed"
              .split(" ")
              .forEach(fieldName => {
                let v = res[fieldName];
                let v2 = trip[fieldName];
                expect(v.toString()).to.equal(v2.toString());
              });
          });
      });
      it(` updates a place`, async () => {
        let {...place}   = await TripsService.getPlaceByID(db, 1);
       place.name= "Powells books"
       place.street_address= "1005 W Burnside St"
       place.city= "Portland"
       place.transportation= "Taxi"
       place.notes= "Cool independent book store that Jenn told me about"
        
        const body = {
          place
        };
        return supertest(app)
          .post(`/api/trips/1/upsertPlace`)
          .send(body.place)
          .set({ Authorization: `Bearer ${authToken}` })
          .then(r => JSON.parse(r.text))
          .then(async res => {
            let result=res.places.filter(p=>p.id===place.id)
            "id name street_address city transportation notes"
              .split(" ")
              .forEach(fieldName => {
                let v = result[0][fieldName];
                let v2 = place[fieldName];
                expect(v.toString()).to.equal(v2.toString());
              });
          });
      });
      it(` creates a place`, async () => {
        let newPlace=   
       {id:-1,
         name: "Penisula Park",
         trip_id: 1,
       street_address: "103 N Penisula Park Dr",
       city: "Portland",
       transportation: "Bike",
       notes: "Cool rose garden",
      visited:false}
        
        const body = {
          newPlace
        };
        return supertest(app)
          .post(`/api/trips/1/upsertPlace`)
          .send(body.newPlace)
          .set({ Authorization: `Bearer ${authToken}` })
          .then(r => JSON.parse(r.text))
          .then(async res => {
            let result=res.places.filter(p=>p.name===newPlace.name)
            "name street_address city transportation notes"
              .split(" ")
              .forEach(fieldName => {
                let v = result[0][fieldName];
                let v2 = newPlace[fieldName];
                expect(v.toString()).to.equal(v2.toString());
              });
          });
      });
      it("Deletes a place", async () => {
        const idToRemove = 2;

        return supertest(app)
          .delete(`/api/trips/1/place/${idToRemove}`)
          .set({ Authorization: `Bearer ${authToken}` })
          .then(
            supertest(app)
              .get(`/api/trips/1`)
              .set({ Authorization: `Bearer ${authToken}` })
              .then(res=>{
              expect(res.body.places.includes(idToRemove)).to.equal(false)
            }
          )

      );
    });
  });
});
})
