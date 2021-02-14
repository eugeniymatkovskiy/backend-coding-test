const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const { validateNewRide, validateGetRides, validateGetRide } = require('../middlewares/addRidesValidator');
const rideController = require('./controllers/rideController');

module.exports = (db) => {
  const { addRide, getRides, getRide } = rideController(db);

  /**
   * @typedef Ride
   * @property {integer} rideID
   * @property {integer} startLat
   * @property {integer} startLong
   * @property {integer} endLat
   * @property {integer} endLong
   * @property {string} riderName
   * @property {string} driverName
   * @property {string} driverVehicle
   * @property {string} created
   */

  /**
   * @typedef Error
   * @property {string} error_code.required
   * @property {string} message.required
   */

  /**
   * Check the health of server
   * @route GET /health
   * @returns {string} 200 - Status of the server
   * @returns {Error.model}  default - Unexpected error
   */
  app.get('/health', (req, res) => res.send('Healthy'));

  /**
   * Create new ride
   * @route POST /rides
   * @param {integer} start_lat.body.required - start latitude
   * @param {integer} start_long.body.required - start long
   * @param {integer} end_lat.body.required - end latitude
   * @param {integer} end_long.body.required - end long
   * @param {string} rider_name.body.required - rider name
   * @param {string} driver_name.body.required - driver name
   * @param {string} driver_vehicle.body.required - driver vehicle
   * @returns {Ride.model} 200 - created ride
   * @returns {Error}  default - Unexpected error
   */
  app.post('/rides', jsonParser, validateNewRide, addRide);

  /**
   * Get list of rides
   * @route GET /rides
   * @param {number} page.query - num of page
   * @param {number} limit.query - amount of rides per page
   * @returns {Array.<Ride>} 200 - list of rides
   * @returns {Error.model}  default - Unexpected error
   */
  app.get('/rides', validateGetRides, getRides);

  /**
   * Get ride by id
   * @route GET /rides/{id}
   * @param {number} id.path.required - id of ride
   * @returns {Ride.model} 200 - ride
   * @returns {Error.model}  default - Unexpected error
   */
  app.get('/rides/:id', validateGetRide, getRide);

  return app;
};
