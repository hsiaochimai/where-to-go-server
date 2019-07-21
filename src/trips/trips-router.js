const express = require("express");
const TripsService= require('./trips-service')
const { expressTryCatchWrapper } = require('../helpers')
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });
const tripsRouter = express.Router();

tripsRouter.use(jsonParser)
.route('/')
.get(jwtAuth, expressTryCatchWrapper(async (req, res) => {
    const knex = req.app.get("db");
    const user= JSON.parse(req.user)
    const userId=user.id
    console.log(userId)
    const result= await TripsService.getTrips(knex, userId)
       res.json(result)

}))

tripsRouter
.route('/create')
.post(jwtAuth,jsonParser,  expressTryCatchWrapper(async (req, res, next) => {
    const trip  = req.body
  const knex = req.app.get("db");
  const savedTrip = await TripsService.upsertTrip(knex, trip)
  res.json(savedTrip);
}))
tripsRouter
.route('/:id')
.get(jwtAuth, expressTryCatchWrapper(async (req, res) => {
  const knex = req.app.get("db");
  const result = await TripsService.getTripByID(knex, req.params.id)
  res.json(result)
}))
.delete(jwtAuth, expressTryCatchWrapper(async (req, res, next) => {
  const knex = req.app.get("db");
  await TripsService.deleteTrip(knex, req.params.id)
    .then(() => {
      res.status(204)
        .end()

    })
    .catch(next);
}))


module.exports = tripsRouter;