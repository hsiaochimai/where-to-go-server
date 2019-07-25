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
      console.log(`this is trip`, trip)
      let q = knex("trips").insert(trip, ["id"]);
      
      
      await q.then(returnedInfo => {
        console.log(`Saving trip:`, JSON.stringify(trip, 2, 2))
        id = returnedInfo[0].id; //the INSERT ID
        return returnedInfo;
      });
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
        console.log(`deleted trip id ${id}`);
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
      let q = knex("places").insert(place, ["id"]);

      await q.then(returnedInfo => {
        id = returnedInfo[0].id; //the INSERT ID
        console.log(`hello`, returnedInfo)
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
    console.log(trips.toString());
    await trips.then(data => {
      result = data;
    });
    let promises = [];
    result.forEach(trip => promises.push(populateTripPlaces(trip, knex)));
    await Promise.all(promises);
    return {
      data: result
    };
  }

};
module.exports = TripsService;
