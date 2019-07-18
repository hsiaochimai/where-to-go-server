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
        return user;
      },
  upsertTrip: async(knex,trip)=>{
    Object.keys(trip).forEach(k => {
        if (trip[k] === "") {
          trip[k] = null;
        }
      });
      let { id } = trip;
      const isNew = id === -1;
      delete trip.id;
      if (isNew) {
        let q = knex("trips").insert(trip, ["id"]);
  
  
        await q.then(returnedInfo => {
          id = returnedInfo[0].id; //the INSERT ID
          return returnedInfo;
        });
      } else {
        await knex("trip")
          .where("id", "=", id)
          .update(trip)
          .then(returnedInfo => {
            return returnedInfo;
          });
      }
      return TripsService.getTripByID(knex, id);
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
