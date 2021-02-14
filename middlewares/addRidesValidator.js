const { rideSchema, getRidesQuerySchema, idSchema } = require('../validationSchemas/rideSchema');

module.exports = {
  validateNewRide: async (req, res, next) => {
    try {
      await rideSchema.validateAsync(req.body);
      next();
    } catch (err) {
      console.error('Add new ride validation error: ', err);
      res.send(err);
    }
  },
  validateGetRides: async (req, res, next) => {
    try {
      await getRidesQuerySchema.validateAsync(req.query);
      next();
    } catch (err) {
      console.error('Get ride by id validation error: ', err);
      res.send(err);
    }
  },
  validateGetRide: async (req, res, next) => {
    try {
      await idSchema.validateAsync(req.params);
      next();
    } catch (err) {
      console.error('Get ride by id validation error: ', err);
      res.send(err);
    }
  }
};
