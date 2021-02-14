module.exports = {
  getDataForPagination: (query) => {
    let { page = 1, limit = 2 } = query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const offset = page > 1 ? (page - 1) * limit : 0;

    return { limit, offset };
  },
  prepareParamsForInsert: (body) => [
    body.start_lat,
    body.start_long,
    body.end_lat,
    body.end_long,
    body.rider_name,
    body.driver_name,
    body.driver_vehicle
  ]
};
