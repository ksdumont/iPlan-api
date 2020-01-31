const express = require('express')
const path = require('path')
const TripsService = require('./trips-service')

const tripsRouter = express.Router()
const jsonParser = express.json()

tripsRouter
.route('/')
.get((req, res, next) => {
    TripsService.getAllTrips(req.app.get('db'))
    .then(trips => {
        res.json(trips)
    })
    .catch(next)
})
.post(jsonParser, (req, res, next) => {
    const {title} = req.body
    const newTrip = {title}
    TripsService.insertTrip(req.app.get('db'), newTrip)
    .then(trip => {
        res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${trip.id}`))
        .json(trip)
    })
    .catch(next)
})
tripsRouter
.route('/:id')
.all((req, res, next) => {
    TripsService.getById(req.app.get('db'), req.params.id)
    .then(trip => {
        if (!trip) {
            return res.status(404).json({error: {message: `Trip doesn't exist`}})
        }
        res.trip = trip
        next()
    })
    .catch(next)
})
.get((req, res, next) => {
    res.json(res.trip)
})

module.exports = tripsRouter;