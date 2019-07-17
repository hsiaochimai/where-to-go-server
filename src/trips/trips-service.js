const TripsService={
    getTrips(knex){
       return knex.select('*')
       .from ('trips')
    }
    }
    module.exports = TripsService;