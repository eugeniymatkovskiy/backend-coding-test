const Joi = require('joi');

const latitudeSchema = Joi.number().min(-90).max(90).required();
const longitudeSchema = Joi.number().min(-180).max(180).required();
const nameSchema = Joi.string().min(1);

const rideSchema = Joi.object({
  start_lat: latitudeSchema,
  start_long: longitudeSchema,
  end_lat: latitudeSchema,
  end_long: longitudeSchema,
  rider_name: nameSchema,
  driver_name: nameSchema,
  driver_vehicle: nameSchema
});

const idSchema = Joi.object({
  id: Joi.number().min(1)
});

const getRidesQuerySchema = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1)
});

module.exports = {
  rideSchema,
  idSchema,
  getRidesQuerySchema
};
