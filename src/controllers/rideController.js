const { getDataForPagination, prepareParamsForInsert } = require('../queryPreparation');
const { defaultServerErr, ridesNotFoundErr } = require('../constants');
const RideRepository = require('../repositories/RideRepository');

module.exports = (db) => {
  const rideRepo = new RideRepository(db);
  return {
    addRide: async (req, res) => {
      try {
        const rideData = prepareParamsForInsert(req.body);

        const { id } = await rideRepo.add(rideData);
        const { ride } = await rideRepo.getById(id);

        res.send(ride);
      } catch (err) {
        console.error('Can\'t add new ride: ', err);
        res.send(err.error_code ? err : defaultServerErr);
      }
    },
    getRides: async (req, res) => {
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
    },
    getRide: async (req, res) => {
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
    }
  };
};
