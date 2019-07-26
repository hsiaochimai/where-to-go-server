const populateTripPlaces = async (trip, knex) => {
  const promises = [];
  const placeQuery = knex("places")
    .select("*")
    .where("trip_id", trip.id);

  const placesPromise = placeQuery.then(
    place => {
      trip.places = place;
    }
  );
  promises.push(placesPromise);

  return Promise.all(promises);
};

const TripsService = {
  getTripByID: async (knex, id) => {
    const trip = await knex("trips")
      .select("*")
      .where("id", "=", id)
      .first();
    await populateTripPlaces(trip, knex);
    return trip;
  },
  upsertTrip: async (knex, trip) => {
    Object.keys(trip).forEach(k => {
      if (trip[k] === "") {
        trip[k] = null;
      }
    });
    let { id } = trip;
    const isNew = id === -1;
    delete trip.id;
    
    if (isNew) {
      await knex.schema.raw(`
          SELECT setval('trips_id_seq', (SELECT MAX(id) FROM trips)+1)
            FROM  trips
            `).then(()=>{
            })
      let q = knex("trips").insert(trip, ["id"]);
      
      
      await q.then(returnedInfo => {
        id = returnedInfo[0].id; //the INSERT ID
        return returnedInfo;
      })
      
    } else {
      await knex("trips")
        .where("id", "=", id)
        .update(trip)
        .then(returnedInfo => {
          return returnedInfo;
        });
    }
    return TripsService.getTripByID(knex, id);
  },
  deleteTrip: async (knex, id) => {
    await knex("trips")
      .where("id", "=", id)
      .del()
      .then(() => {
       
      })
  },
  getPlaceByID: async (knex, id) => {
    const place = await knex("places")
      .select("*")
      .where("id", "=", id)
      .first();
    return place;
  },
  upsertPlace: async (knex, place, tripID) => {
    Object.keys(place).forEach(k => {
      if (place[k] === "") {
        place[k] = null;
      }
    });
    let { id } = place;
    const isNew = id === -1;
    delete place.id;
    if (isNew) {
      await knex.schema.raw(`
          SELECT setval('places_id_seq', (SELECT MAX(id) FROM places)+1)
            FROM  places
            `).then(()=>{
            })
      let q = knex("places").insert(place, ["id"]);

      await q.then(returnedInfo => {
        id = returnedInfo[0].id; //the INSERT ID
        return returnedInfo;
      });
    } else {
      await knex("places")
        .where("id", "=", id)
        .update(place)
        .then(returnedInfo => {
          return returnedInfo;
        });
    }
    return TripsService.getTripByID(knex, tripID);
  },
  deletePlace: async (knex, id) => {
    await knex("places")
      .where("id", "=", id)
      .del()
      .then(() => {
        console.log(`deleted place id ${id}`);
      })
  },
  getTrips: async (knex, id) => {
    let trips = knex("trips");
    trips.where("user_id", "=", id);
    let result = [];
    await trips.then(data => {
      result = data;
    });
    let promises = [];
    result.forEach(trip => promises.push(populateTripPlaces(trip, knex)));
    await Promise.all(promises);
    return {
      trips: result
    };
  }

};
module.exports = TripsService;
