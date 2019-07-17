const express = require("express");
const TripsService= require('./trips-service')
const { expressTryCatchWrapper } = require('../helpers')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const tripsRouter = express.Router();

tripsRouter
.route('/')
.get(expressTryCatchWrapper(async (req, res) => {
    const knex = req.app.get("db");

    const result= await TripsService.getTrips(knex)
       res.json(result)

}))



module.exports = tripsRouter;