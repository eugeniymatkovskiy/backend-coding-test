const request = require('supertest');
const { expect } = require('chai');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

let createdRideId = 0;
const reqBody = {
  start_lat: 45,
  start_long: 120,
  end_lat: 85,
  end_long: 160,
  rider_name: 'Valera',
  driver_name: 'Gosha',
  driver_vehicle: 'Horse'
};

const toCamel = (s) => s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
  .replace('-', '')
  .replace('_', ''));

const expectedRide = {};
for (const [k, v] of Object.entries(reqBody)) {
  expectedRide[toCamel(k)] = v;
}

describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
        .get('/health')
        .expect('Content-Type', /text/)
        .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return non rides', (done) => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.deep.equal({
            error_code: 'RIDES_NOT_FOUND_ERROR',
            message: 'Could not find any rides',
          });
          done();
        });
    });
  });

  describe('POST /rides', () => {
    it('must create new ride', (done) => {
      request(app)
        .post('/rides')
        .send(reqBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          const { body } = res;

          expect(body).to.be.an('array');
          const createdRide = body.pop();
          expect(createdRide).to.deep.include(expectedRide);
          expect(createdRide).to.not.have.all.keys('rideID');
          createdRideId = createdRide.rideID;

          done();
        });
    });
  });

  describe('GET /rides', () => {
    it('should return one ride', (done) => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          const { body } = res;

          expect(body).to.be.an('array');
          expect(body.length).to.equal(1);
          const createdRide = body.pop();
          expect(createdRide).to.deep.include({ ...expectedRide, ...{ rideID: createdRideId } });
          done();
        });
    });
  });

  describe('GET /rides/:id', () => {
    it('should return ride by id', (done) => {
      request(app)
        .get(`/rides/${createdRideId}`)
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          const { body } = res;
          expect(body).to.be.an('array');
          expect(body.length).to.equal(1);
          const createdRide = body.pop();
          expect(createdRide).to.deep.include({ ...expectedRide, ...{ rideID: createdRideId } });
          done();
        });
    });
  });

  describe('GET /rides', () => {
    before(() => {
      for (let i = 1; i < 5; i++) {
        const data = { ...reqBody };
        data.driver_name += i;
        request(app)
          .post('/rides')
          .send(data)
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .end(() => {});
      }
    });

    it('should return first two rides', (done) => {
      request(app)
        .get('/rides')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(2);
          done();
        });
    });

    it('should return last ride (pagination test)', (done) => {
      request(app)
        .get('/rides?page=3')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(1);
          done();
        });
    });

    it('should return all rides', (done) => {
      request(app)
        .get('/rides?limit=10')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(5);
          done();
        });
    });
  });
});
