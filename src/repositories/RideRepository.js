class RideRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  add(data) {
    return new Promise((res, rej) => {
      this.db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)',
        data,
        function (err) {
          if (err) {
            rej(err);
          }

          res({ id: this.lastID });
        });
    });
  }

  getRides(limit, offset) {
    return new Promise((res, rej) => {
      this.db.all('SELECT * FROM Rides ORDER BY rideID LIMIT ? OFFSET ?', [limit, offset], (err, rows) => {
        if (err) {
          rej(err);
        }

        res({ rows });
      });
    });
  }

  getById(id) {
    return new Promise((res, rej) => {
      this.db.all('SELECT * FROM Rides WHERE rideID = ?', id, (err, rows) => {
        if (err) {
          rej(err);
        }

        res({ ride: rows.length ? rows.pop() : null });
      });
    });
  }
}

module.exports = RideRepository;
