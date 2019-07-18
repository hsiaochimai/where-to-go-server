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
