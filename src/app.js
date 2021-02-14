const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const { validateNewRide, validateGetRides, validateGetRide } = require('../middlewares/addRidesValidator');
const { getDataForPagination, prepareParamsForInsert } = require('./queryPreparation');
const RideRepository = require('./repositories/RideRepository');
const { defaultServerErr, ridesNotFoundErr } = require('./constants');

module.exports = (db) => {
  const rideRepo = new RideRepository(db);

  /**
   * Check the health of server
   * @route GET /health
   * @returns {string} 200 - Status of the server
   * @returns {Error}  default - Unexpected error
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
   * @returns {object} 200 - created ride
   * @returns {Error}  default - Unexpected error
   */
  app.post('/rides', jsonParser, validateNewRide, async (req, res) => {
    try {
      const rideData = prepareParamsForInsert(req.body);

      const { id } = await rideRepo.add(rideData);
      const { ride } = await rideRepo.getById(id);

      res.send(ride);
    } catch (err) {
      console.error('Can\'t add new ride: ', err);
      res.send(err.error_code ? err : defaultServerErr);
    }
  });

  /**
   * Get list of rides
   * @route GET /rides
   * @param {number} page.query - num of page
   * @param {number} limit.query - amount of rides per page
   * @returns {string} 200 - list of rides
   * @returns {Error}  default - Unexpected error
   */
  app.get('/rides', validateGetRides, async (req, res) => {
    try {
      const { limit, offset } = getDataForPagination(req.query);
      const { rows } = await rideRepo.getRides(limit, offset);

      if (rows.length === 0) {
        throw ridesNotFoundErr;
      }

      res.send(rows);
    } catch (err) {
      console.error('Can\'t get rides: ', err);
      res.send(err.error_code ? err : defaultServerErr);
    }
  });

  /**
   * Get ride by id
   * @route GET /rides/{id}
   * @param {number} id.path.required - id of ride
   * @returns {string} 200 - ride
   * @returns {Error}  default - Unexpected error
   */
  app.get('/rides/:id', validateGetRide, async (req, res) => {
    try {
      const { ride } = await rideRepo.getById(req.params.id);
      if (!ride) {
        throw ridesNotFoundErr;
      }

      res.send(ride);
    } catch (err) {
      console.error('Can\'t get ride by id: ', err);
      res.send(err.error_code ? err : defaultServerErr);
    }
  });

  return app;
};
