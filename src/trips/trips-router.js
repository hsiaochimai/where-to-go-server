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



module.exports = tripsRouter;