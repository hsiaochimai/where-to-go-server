const TripsService={
    getTrips(knex, id){
       return knex.select('*')
       .from ('trips')
       .where('user_id', '=', id)
       
       
    }
    }
    module.exports = TripsService;